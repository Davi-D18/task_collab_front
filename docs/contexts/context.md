# Contextos

Esta seção documenta os contextos React utilizados para gerenciamento de estado global na aplicação TaskCollab.

## AuthContext

**Arquivo:** `src/contexts/AuthContext.jsx`

**Descrição:** Gerencia o estado de autenticação do usuário em toda a aplicação.

### Estado Gerenciado
- `user`: Objeto contendo dados do usuário autenticado
- `loading`: Estado de carregamento durante operações de autenticação
- `isAuthenticated`: Boolean que indica se o usuário está autenticado

### Funções Expostas

#### login(credential, password)
Autentica o usuário com credenciais (email ou nome de usuário) e senha.

**Parâmetros:**
- `credential` (string): Email ou nome de usuário
- `password` (string): Senha do usuário

**Processo:**
1. Verifica se a credencial é um email ou nome de usuário
2. Processa o nome de usuário para substituir espaços por underlines
3. Envia requisição para a API de login
4. Armazena tokens (access e refresh) no localStorage
5. Decodifica o token JWT para obter informações do usuário
6. Armazena dados do usuário no estado e localStorage
7. Configura o token de autorização nos headers da API
8. Exibe notificação de sucesso e redireciona para a página inicial

#### register(email, password, name)
Registra um novo usuário no sistema.

**Parâmetros:**
- `email` (string): Email do usuário
- `password` (string): Senha do usuário
- `name` (string): Nome de usuário

**Processo:**
1. Processa o nome de usuário para substituir espaços por underlines
2. Envia requisição para a API de registro
3. Exibe notificação de sucesso e redireciona para a página de login

#### logout()
Encerra a sessão do usuário.

**Processo:**
1. Remove tokens e dados do usuário do localStorage
2. Remove o token de autorização dos headers da API
3. Limpa o estado do usuário
4. Redireciona para a página de login

#### refreshToken(originalRequest)
Atualiza o token de acesso expirado usando o refresh token.

**Parâmetros:**
- `originalRequest` (Object, opcional): Requisição original que falhou por token expirado

**Processo:**
1. Obtém o refresh token do localStorage
2. Envia requisição para a API de refresh
3. Armazena o novo token de acesso no localStorage
4. Atualiza o token de autorização nos headers da API
5. Se houver uma requisição original, atualiza seu header de autorização

### Implementação de Refresh Token Automático

O contexto configura um interceptor Axios que captura erros 401 (Unauthorized) e tenta automaticamente renovar o token antes de reenviar a requisição original.

### Exemplo de Uso

```jsx
import { useAuth } from "../contexts/AuthContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
      <button type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
```

```jsx
import { useAuth } from "../contexts/AuthContext";

function UserProfile() {
  const { user, logout } = useAuth();
  
  if (!user) return null;
  
  return (
    <div>
      <h1>Bem-vindo, {user.username}!</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```