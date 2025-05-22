import axios from "axios"

const urlApi = import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL: urlApi, 
})

// Variável para armazenar a função refreshToken do AuthContext
let authRefreshToken = null;

// Função para configurar o refreshToken do AuthContext
export const setAuthRefreshToken = (refreshTokenFn) => {
  authRefreshToken = refreshTokenFn;
};

// Interceptor para lidar com tokens expirados e formatar erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (Unauthorized) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Verifica se é o erro específico de token inválido
      const isTokenInvalid = error.response?.data?.errors?.some(
        err => err.field === "general" && err.message.includes("token informado não é válido")
      );
      
      if (isTokenInvalid || !originalRequest.url.includes("login/refresh")) {
        originalRequest._retry = true;

        try {
          // Usa a função refreshToken do AuthContext
          if (!authRefreshToken) {
            throw new Error("Auth refresh token function not available");
          }
          
          await authRefreshToken(originalRequest);
          
          // Refaz a requisição original com o novo token
          return api(originalRequest);
        } catch (refreshError) {
          // Erro já tratado no AuthContext
          return Promise.reject(refreshError);
        }
      }
    }

    // Formatar erros da API para um formato padronizado
    if (error.response?.data?.errors) {
      // A API já retornou erros no formato esperado
      return Promise.reject(error)
    } else if (error.response?.data) {
      // Converter outros formatos de erro para o formato padronizado
      const formattedError = {
        ...error,
        response: {
          ...error.response,
          data: {
            title: "Erro",
            errors: [
              {
                field: "general",
                message: error.response.data.detail || error.message || "Ocorreu um erro inesperado"
              }
            ]
          }
        }
      }
      return Promise.reject(formattedError)
    }

    return Promise.reject(error)
  },
)

export const taskService = {
  getAll: () => api.get("/tasks/"),
  getById: (id) => api.get(`/tasks/${id}/`),
  create: (data) => api.post("/tasks/", data),
  delete: (id) => api.delete(`/tasks/${id}/`),
  update: (id, data) => api.put(`/tasks/${id}/`, data)
}
