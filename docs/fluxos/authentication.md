# Fluxo de Autenticação

Este documento descreve o fluxo completo de autenticação na aplicação TaskCollab.

## Visão Geral

O sistema de autenticação do TaskCollab utiliza tokens JWT (JSON Web Tokens) para gerenciar sessões de usuário, com um mecanismo de refresh token para manter os usuários autenticados por períodos mais longos sem comprometer a segurança.

## Componentes Envolvidos

- **AuthContext**: Gerencia o estado de autenticação e expõe funções para login, registro e logout
- **api.js**: Configura interceptores para lidar com tokens expirados e renovação automática
- **ProtectedRoute**: Componente que protege rotas que requerem autenticação

## Fluxos Principais

### 1. Registro de Usuário

#### Processo:

1. O usuário acessa a página de registro (`/register`)
2. Preenche os campos de formulário:
   - Email
   - Nome de usuário
   - Senha
3. O sistema processa o nome de usuário:
   - Remove espaços extras
   - Substitui espaços por underscores usando `substituirEspacosPorUnderline`
4. A requisição é enviada para a API (`/accounts/register/`)
5. Em caso de sucesso:
   - Uma notificação de sucesso é exibida
   - O usuário é redirecionado para a página de login
6. Em caso de erro:
   - Uma notificação de erro é exibida com detalhes do problema
   - O usuário permanece na página de registro para corrigir os dados

#### Código relevante:

```jsx
// Em AuthContext.jsx
const register = async (email, password, name) => {
  try {
    setLoading(true)
    const usernameSemEspacos = substituirEspacosPorUnderline(name)
    await api.post("/accounts/register/", {
      email: email,
      username: usernameSemEspacos,
      password: password,
    })
    toast({
      title: "Registro bem-sucedido",
      description: "Sua conta foi criada com sucesso!",
    })
    navigate("/login")
  } catch (error) {
    // Tratamento de erros...
  } finally {
    setLoading(false)
  }
}
```

### 2. Login

#### Processo:

1. O usuário acessa a página de login (`/login`)
2. Preenche os campos de formulário:
   - Credencial (email ou nome de usuário)
   - Senha
3. O sistema verifica se a credencial é um email:
   - Se for email, usa o valor como está
   - Se não for email, processa como nome de usuário usando `substituirEspacosPorUnderline`
4. A requisição é enviada para a API (`/accounts/login/`)
5. Em caso de sucesso:
   - Os tokens (access e refresh) são armazenados no localStorage
   - O token de acesso é configurado nos headers da API
   - Os dados do usuário são armazenados no localStorage e no estado do AuthContext
   - Uma notificação de boas-vindas é exibida
   - O usuário é redirecionado para a página inicial
6. Em caso de erro:
   - Uma notificação de erro é exibida com detalhes do problema
   - O usuário permanece na página de login para corrigir os dados

#### Código relevante:

```jsx
// Em AuthContext.jsx
const login = async (credential, password) => {
  try {
    setLoading(true)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credential);
    const processedCredential = isEmail ? credential : substituirEspacosPorUnderline(credential);
    
    const response = await api.post("/accounts/login/", {
      credential: processedCredential,
      password: password,
    })

    const { access, refresh, user } = response.data
    // Processamento e armazenamento dos tokens e dados do usuário...
    
    navigate("/")
  } catch (error) {
    // Tratamento de erros...
  } finally {
    setLoading(false)
  }
}
```

### 3. Refresh de Token

#### Processo:

1. Quando uma requisição à API falha com erro 401 (Unauthorized):
   - O interceptor em `api.js` captura o erro
   - Verifica se o erro é devido a um token expirado
   - Marca a requisição como em retry para evitar loops infinitos
2. O interceptor chama a função `refreshToken` do AuthContext
3. A função `refreshToken`:
   - Obtém o refresh token do localStorage
   - Envia uma requisição para a API (`/accounts/login/refresh/`)
   - Recebe um novo token de acesso
   - Atualiza o token no localStorage e nos headers da API
4. O interceptor reenviar a requisição original com o novo token
5. Se o refresh token também estiver inválido ou expirado:
   - O usuário é deslogado
   - Redirecionado para a página de login

#### Código relevante:

```jsx
// Em AuthContext.jsx
const refreshToken = async (originalRequest = null) => {
  try {
    const refresh = localStorage.getItem("@TaskCollab:refresh")
    if (!refresh) {
      throw new Error("No refresh token available")
    }
    const response = await axios.post(`${import.meta.env.VITE_API_URL}accounts/login/refresh/`, {
      refresh,
    })
    const { access } = response.data
    localStorage.setItem("@TaskCollab:token", access)
    api.defaults.headers.common["Authorization"] = `Bearer ${access}`
    
    if (originalRequest) {
      originalRequest.headers["Authorization"] = `Bearer ${access}`
    }
    return access
  } catch (error) {
    logout()
    throw error
  }
}
```

### 4. Logout

#### Processo:

1. O usuário clica no botão de logout na interface
2. A função `logout` do AuthContext é chamada
3. A função:
   - Remove os tokens e dados do usuário do localStorage
   - Remove o token de autorização dos headers da API
   - Limpa o estado do usuário no AuthContext
   - Redireciona o usuário para a página de login

#### Código relevante:

```jsx
// Em AuthContext.jsx
const logout = () => {
  localStorage.removeItem("@TaskCollab:token")
  localStorage.removeItem("@TaskCollab:refresh")
  localStorage.removeItem("@TaskCollab:user")
  delete api.defaults.headers.common["Authorization"]
  setUser(null)
  navigate("/login")
}
```

### 5. Proteção de Rotas

#### Processo:

1. As rotas que requerem autenticação são envolvidas pelo componente `ProtectedRoute`
2. Quando o usuário tenta acessar uma rota protegida:
   - O componente verifica se o usuário está autenticado usando o AuthContext
   - Se estiver autenticado, permite o acesso à rota
   - Se não estiver autenticado, redireciona para a página de login
   - Durante a verificação, exibe um spinner de carregamento

#### Código relevante:

```jsx
// Em ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}
```

## Armazenamento de Dados

O sistema utiliza o localStorage para persistir dados de autenticação entre sessões:

- `@TaskCollab:token`: Token de acesso JWT
- `@TaskCollab:refresh`: Token de refresh para renovar o token de acesso
- `@TaskCollab:user`: Dados do usuário em formato JSON

## Segurança

- Tokens JWT têm tempo de expiração curto (geralmente 15-30 minutos)
- O refresh token tem tempo de expiração mais longo (geralmente 7-30 dias)
- Todas as requisições autenticadas incluem o token no header Authorization
- Senhas nunca são armazenadas no cliente, apenas tokens