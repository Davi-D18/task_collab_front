import { createContext, useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../services/api"
import { useToast } from "../components/Toast/ToastContainer"

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  function substituirEspacosPorUnderline(nomeUsuario) {
    // Remove espaços duplos, tabs e qualquer tipo de espaço, substituindo por um único _
    return nomeUsuario.replace(/\s+/g, '_').trim();
  }

  useEffect(() => {
    const token = localStorage.getItem("@TimeCapsule:token")
    const storedUser = localStorage.getItem("@TimeCapsule:user")

    if (token && storedUser) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await api.post("/accounts/login", {
        email: email,
        password: password,
      })

      const { access, refresh, user } = response.data

      const cleanedUsername = user.username.replace(/_/g, " ");

      localStorage.setItem("@TimeCapsule:token", access)
      localStorage.setItem("@TimeCapsule:refresh", refresh)

      api.defaults.headers.common["Authorization"] = `Bearer ${access}`

      // Fetch user data or use JWT payload
      const userData = { user } // Simplified for now
      localStorage.setItem(
        "@TimeCapsule:user",
        JSON.stringify({ ...user, username: cleanedUsername })
      );

      setUser({ ...user, username: cleanedUsername });

      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo ao TimeCapsule ${cleanedUsername}!`,
      })

      navigate("/")
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: error.response?.data?.detail || "Credenciais inválidas",
        type: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password, name) => {
    try {
      setLoading(true)

      const usernameSemEspacos = substituirEspacosPorUnderline(name)

      await api.post("/accounts/register", {
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
      toast({
        title: "Erro ao registrar",
        description: error.response?.data.username || error.response?.data.email || "Não foi possível criar sua conta",
        type: "destructive",
      })
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("@TimeCapsule:token")
    localStorage.removeItem("@TimeCapsule:refresh")
    localStorage.removeItem("@TimeCapsule:user")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
    navigate("/login")
  }

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem("@TimeCapsule:refresh")

      if (!refresh) {
        throw new Error("No refresh token available")
      }

      const response = await api.post("/api/token/refresh/", {
        refresh,
      })

      const { access } = response.data
      localStorage.setItem("@TimeCapsule:token", access)
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`

      return access
    } catch (error) {
      logout()
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshToken,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
