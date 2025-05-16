import { Clock } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import styles from "./Login.module.scss"

const Login = () => {
  const [credential, setCredential] = useState("")
  const [password, setPassword] = useState("")
  const { login, loading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation();
    
    await login(credential, password)
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <Clock size={40} className={styles.logoIcon} />
          <h1 className={styles.logoText}>TaskCollab</h1>
        </div>

        <h2 className={styles.title}>Bem-vindo de volta</h2>
        <p className={styles.subtitle}>Entre para acessar suas tarefas</p>

        <form onSubmit={(e) => handleSubmit(e)} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="credential" className={styles.label}>
              Email ou Nome de Usuário
            </label>
            <input
              id="credential"
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              className={styles.input}
              placeholder="seu@email.com ou seu_usuario"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Sua senha"
              required
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className={styles.registerLink}>
          Não tem uma conta? <Link to="/register">Registre-se</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
