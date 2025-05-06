import { Link } from "react-router-dom"
import { Clock } from "lucide-react"
import styles from "./NotFound.module.scss"

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.content}>
        <Clock size={80} className={styles.icon} />
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Página não encontrada</h2>
        <p className={styles.message}>A página que você está procurando não existe ou foi removida.</p>
        <Link to="/" className={styles.button}>
          Voltar para o início
        </Link>
      </div>
    </div>
  )
}

export default NotFound
