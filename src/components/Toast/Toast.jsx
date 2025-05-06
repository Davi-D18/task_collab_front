import { useEffect } from "react"
import styles from "./Toast.module.scss"
import { X } from "lucide-react"

const Toast = ({ id, title, description, type = "default", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onClose])

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.content}>
        {title && <h4 className={styles.title}>{title}</h4>}
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <button className={styles.closeButton} onClick={() => onClose(id)}>
        <X size={18} />
      </button>
    </div>
  )
}

export default Toast
