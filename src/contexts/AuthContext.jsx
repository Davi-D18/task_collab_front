import { createContext, useContext, useEffect, useRef, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useToast } from "../components/Toast/ToastContainer"
import { api } from "../services/api"
import { substituirEspacosPorUnderline } from "../utils/stringUtils"

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // Criando a referência sem dependência inicial
  const refreshTokenRef = useRef(null);
  
  // Função para fazer logout
  const logout = () => {
    localStorage.removeItem("@TaskCollab:token")
    localStorage.removeItem("@TaskCollab:refresh")
    localStorage.removeItem("@TaskCollab:user")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
    navigate("/login")
  }
  
  // Definindo refreshToken
  const refreshToken = async (originalRequest = null) => {
    try {
      const refresh = localStorage.getItem("@TaskCollab:refresh")

      if (!refresh) {
        throw new Error("No refresh token available")
      }

      // Usando axios diretamente para evitar loop com o interceptor
      const response = await axios.post(`${import.meta.env.VITE_API_URL}accounts/login/refresh/`, {
        refresh,
      })

      const { access } = response.data
      localStorage.setItem("@TaskCollab:token", access)
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`
      
      // Se houver uma requisição original, atualiza o header dela também
      if (originalRequest) {
        originalRequest.headers["Authorization"] = `Bearer ${access}`
      }

      return access
    } catch (error) {
      logout()
      throw error
    }
  }
  
  // Atualiza a referência com a função refreshToken
  refreshTokenRef.current = refreshToken;
  
  useEffect(() => {
    const token = localStorage.getItem("@TaskCollab:token")
    const storedUser = localStorage.getItem("@TaskCollab:user")

    if (token && storedUser) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(JSON.parse(storedUser))
    }

    // Configura a função refreshToken no interceptor
    import("../services/api").then(({ setAuthRefreshToken }) => {
      setAuthRefreshToken((...args) => refreshTokenRef.current(...args));
    });

    setLoading(false)
  }, [])

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  const login = async (credential, password) => {
    try {
      setLoading(true)
      
      // Verifica se é email usando regex simples
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credential);
      
      // Se não for email, trata como username e remove espaços
      const processedCredential = isEmail ? credential : substituirEspacosPorUnderline(credential);
      
      const response = await api.post("/accounts/login/", {
        credential: processedCredential,
        password: password,
      })

      const { access, refresh, user } = response.data

      // Decodifica o token para obter as informações do usuário
      const decodedToken = decodeJWT(access);
      const username = decodedToken?.username || user.username;
      const cleanedUsername = username.replace(/_/g, " ");

      localStorage.setItem("@TaskCollab:token", access)
      localStorage.setItem("@TaskCollab:refresh", refresh)

      api.defaults.headers.common["Authorization"] = `Bearer ${access}`

      // Usa o username do token decodificado
      const userData = { ...user, username: cleanedUsername };
      localStorage.setItem(
        "@TaskCollab:user",
        JSON.stringify(userData)
      );

      setUser(userData);

      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo ao TaskCollab ${cleanedUsername}!`,
      })

      navigate("/")
    } catch (error) {
      // Verifica se há erros específicos de campo retornados pela API
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        // Exibe apenas o primeiro erro para não sobrecarregar o usuário
        const firstError = errors[0];
        
        toast({
          title: "Erro ao fazer login",
          description: `${firstError.message}`,
          type: "destructive",
        })
      } else {
        toast({
          title: "Erro ao fazer login",
          description: error.response?.data?.detail || "Credenciais inválidas",
          type: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

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
      // Verifica se há erros específicos de campo retornados pela API
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        // Exibe apenas o primeiro erro para não sobrecarregar o usuário
        const firstError = errors[0];
        
        toast({
          title: error.response.data.title || "Erro ao registrar",
          description: `${firstError.field}: ${firstError.message}`,
          type: "destructive",
        })
      } else {
        toast({
          title: "Erro ao registrar",
          description: error.response?.data.username || error.response?.data.email || "Não foi possível criar sua conta",
          type: "destructive",
        })
      }
      console.log(error)
    } finally {
      setLoading(false)
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
