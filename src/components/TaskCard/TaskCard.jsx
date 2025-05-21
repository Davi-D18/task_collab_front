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
        return { color: "#ef4444", fontWeight: "bold", borderBottom: "2px solid #ef4444" }
      case "Media":
        return { color: "#f59e0b", fontWeight: "bold", borderBottom: "2px solid #f59e0b" }
      case "Baixa":
        return { color: "#10b981", fontWeight: "bold", borderBottom: "2px solid #10b981" }
      default:
        return { color: "#6b7280", fontWeight: "normal" }
    }
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case "Concluída":
        return {
          icon: <CheckCircle2 size={16} color="#ffffff" />,
          label: "Concluída",
          style: { 
            color: "#ffffff", 
            backgroundColor: "#10b981", 
            padding: "2px 8px", 
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontWeight: "bold",
            whiteSpace: "nowrap"
          }
        }
      case "Em Andamento":
        return {
          icon: <AlertCircle size={16} color="#ffffff" />,
          label: "Em Andamento",
          style: { 
            color: "#ffffff", 
            backgroundColor: "#f59e0b", 
            padding: "2px 8px", 
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontWeight: "bold",
            whiteSpace: "nowrap"
          }
        }
      default:
        return {
          icon: <Clock size={16} color="#ffffff" />,
          label: "Pendente",
          style: { 
            color: "#ffffff", 
            backgroundColor: "#6b7280", 
            padding: "2px 8px", 
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontWeight: "bold",
            whiteSpace: "nowrap"
          }
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
          <span className={styles.priority} style={getPriorityColor(task.prioridade_display)}>
            {task.prioridade_display || "Normal"}
          </span>
          <span className={styles.status} style={statusInfo.style}>
            {statusInfo.icon}
            {statusInfo.label}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default TaskCard