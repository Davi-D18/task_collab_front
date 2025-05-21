import { AlertCircle, CheckCircle2, Clock, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { formatDate } from "../../utils/formatDate"
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Alta":
        return "#ef4444"
      case "Media":
        return "#f59e0b"
      case "Baixa":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case "Concluída":
        return {
          icon: <CheckCircle2 size={16} color="#10b981" />,
          label: "Concluída",
          color: "#10b981"
        }
      case "Em Andamento":
        return {
          icon: <AlertCircle size={16} color="#f59e0b" />,
          label: "Em andamento",
          color: "#f59e0b"
        }
      default:
        return {
          icon: <Clock size={16} color="#6b7280" />,
          label: "Pendente",
          color: "#6b7280"
        }
    }
  }

  const statusInfo = getStatusInfo(task.status_display)

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
        {task.descricao.length > 50
          ? `${task.descricao.substring(0, 150)}...`
          : task.descricao}
      </p>
      <div className={styles.footer}>
        <div className={styles.date}>
          <Clock size={14} />
          <span>Criada em {formatDate(task.criado_em)}</span>
        </div>
        <div className={styles.metadata}>
          <span className={styles.priority} style={{ color: getPriorityColor(task.prioridade_display) }}>
            {task.prioridade}
          </span>
          <span className={styles.status} style={{ color: statusInfo.color }}>
            {statusInfo.icon}
            {statusInfo.label}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default TaskCard