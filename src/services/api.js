import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
})

// Interceptor para lidar com tokens expirados
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Se o erro for 401 (Unauthorized) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Tenta obter um novo token usando o refreshToken
        const refreshToken = localStorage.getItem("@TaskCollab:refresh")

        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        const response = await axios.post("http://localhost:8000/api/token/refresh/", {
          refresh: refreshToken,
        })

        const { access } = response.data

        // Atualiza o token no localStorage e nos headers
        localStorage.setItem("@TaskCollab:token", access)
        api.defaults.headers.common["Authorization"] = `Bearer ${access}`
        originalRequest.headers["Authorization"] = `Bearer ${access}`

        // Refaz a requisição original com o novo token
        return api(originalRequest)
      } catch (refreshError) {
        // Se falhar ao obter novo token, redireciona para login
        localStorage.removeItem("@TaskCollab:token")
        localStorage.removeItem("@TaskCollab:refresh")
        localStorage.removeItem("@TaskCollab:user")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
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
