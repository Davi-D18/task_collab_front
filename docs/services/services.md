# Serviços

Esta seção documenta os serviços utilizados para comunicação com APIs e outras funcionalidades externas na aplicação TaskCollab.

## API Service

**Arquivo:** `src/services/api.js`

**Descrição:** Configuração central do Axios para comunicação com a API backend.

### Configuração Base

```javascript
import axios from "axios"

const urlApi = import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL: urlApi, 
})
```

A instância do Axios é configurada com a URL base definida na variável de ambiente `VITE_API_URL`.

### Sistema de Refresh Token

O serviço implementa um sistema de refresh token automático que:

1. Captura erros 401 (Unauthorized) nas requisições
2. Verifica se o erro é devido a um token expirado
3. Tenta renovar o token usando a função `refreshToken` do AuthContext
4. Reenviar a requisição original com o novo token

```javascript
// Variável para armazenar a função refreshToken do AuthContext
let authRefreshToken = null;

// Função para configurar o refreshToken do AuthContext
export const setAuthRefreshToken = (refreshTokenFn) => {
  authRefreshToken = refreshTokenFn;
};
```

A função `setAuthRefreshToken` é chamada pelo AuthContext para fornecer a função de refresh token.

### Interceptor de Resposta

O serviço configura um interceptor de resposta que:

1. Processa respostas bem-sucedidas normalmente
2. Captura erros e tenta renovar tokens expirados
3. Formata erros da API para um formato padronizado

```javascript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Lógica de tratamento de erros e refresh token
    // ...
  }
)
```

### Formatação de Erros

O serviço padroniza o formato de erros retornados pela API:

```javascript
{
  title: "Erro",
  errors: [
    {
      field: "campo_com_erro",
      message: "Mensagem de erro"
    }
  ]
}
```

### Task Service

O arquivo também exporta um serviço específico para operações relacionadas a tarefas:

```javascript
export const taskService = {
  getAll: () => api.get("/tasks/"),
  getById: (id) => api.get(`/tasks/${id}/`),
  create: (data) => api.post("/tasks/", data),
  delete: (id) => api.delete(`/tasks/${id}/`),
  update: (id, data) => api.put(`/tasks/${id}/`, data)
}
```

#### Métodos

- **getAll()**: Obtém todas as tarefas do usuário
- **getById(id)**: Obtém uma tarefa específica pelo ID
- **create(data)**: Cria uma nova tarefa
- **delete(id)**: Exclui uma tarefa pelo ID
- **update(id, data)**: Atualiza uma tarefa existente

### Exemplo de Uso

```jsx
import { taskService } from "../services/api";
import { useState, useEffect } from "react";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskService.getAll();
        setTasks(response.data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);
  
  return (
    <div>
      {loading ? (
        <p>Carregando tarefas...</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```