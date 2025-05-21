import { Clock, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { formatDate } from "../../utils/formatDate"
import StatusBadge from "../UI/StatusBadge"
import PriorityBadge from "../UI/PriorityBadge"
import styles from "./TaskCard.module.scss"

const TaskCard = ({ task, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      setIsDeleting(true)
      try {
        await onDelete(task.id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const isCompleted = task.status_display === "Concluída"

  return (
    <Link 
      to={`/tasks/${task.id}`} 
      className={`${styles.card} ${isCompleted ? styles.completed : ''}`}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{task.titulo}</h3>
        <button onClick={handleDelete} className={styles.deleteButton} disabled={isDeleting}>
          <Trash2 size={18} />
        </button>
      </div>
      <p className={styles.description}>
        {task.descricao.length > 150
          ? `${task.descricao.substring(0, 150)}...`
          : task.descricao}
      </p>
      <div className={styles.footer}>
        <div className={styles.date}>
          <Clock size={14} />
          <span>Criada em {formatDate(task.criado_em)}</span>
        </div>
        <div className={styles.metadata}>
          <PriorityBadge priority={task.prioridade_display} />
          <StatusBadge status={task.status_display} />
        </div>
      </div>
    </Link>
  )
}

export default TaskCard