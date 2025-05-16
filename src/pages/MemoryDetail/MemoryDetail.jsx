import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import { useToast } from "../../components/Toast/ToastContainer"
import { taskService } from "../../services/api"
import { formatDate } from "../../utils/formatDate"
import styles from "./TaskDetail.module.scss"

const TaskDetail = () => {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    fetchTask()
  }, [id])

  const fetchTask = async () => {
    try {
      setLoading(true)
      const response = await taskService.getById(id)
      setTask(response.data)
    } catch (error) {
      toast({
        title: "Erro ao carregar tarefa",
        description: "Não foi possível carregar a tarefa. Tente novamente mais tarde.",
        type: "destructive",
      })
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        setDeleting(true)
        await taskService.delete(id)
        toast({
          title: "Tarefa excluída",
          description: "Sua tarefa foi excluída com sucesso.",
        })
        navigate("/")
      } catch (error) {
        toast({
          title: "Erro ao excluir tarefa",
          description: "Não foi possível excluir sua tarefa. Tente novamente mais tarde.",
          type: "destructive",
        })
        setDeleting(false)
      }
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "alta":
        return "#ef4444"
      case "media":
        return "#f59e0b"
      case "baixa":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "concluida":
        return <CheckCircle2 size={16} color="#10b981" />
      case "em_andamento":
        return <AlertCircle size={16} color="#f59e0b" />
      default:
        return <Clock size={16} color="#6b7280" />
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className={styles.taskDetail}>
      <button onClick={() => navigate("/")} className={styles.backButton}>
        <ArrowLeft size={18} />
        <span>Voltar</span>
      </button>

      <div className={styles.taskCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>{task.titulo}</h1>
          <button onClick={handleDelete} className={styles.deleteButton} disabled={deleting}>
            <Trash2 size={18} />
            <span>Excluir</span>
          </button>
        </div>

        <div className={styles.metadata}>
          <div className={styles.metaItem}>
            <Clock size={16} />
            <span>Criada em {formatDate(task.criado_em)}</span>
          </div>
          <div className={styles.metaItem} style={{ color: getPriorityColor(task.prioridade) }}>
            <span>Prioridade: {task.prioridade}</span>
          </div>
          <div className={styles.metaItem}>
            {getStatusIcon(task.status)}
            <span>Status: {task.status}</span>
          </div>
        </div>

        <div className={styles.content}>
          <h3>Descrição</h3>
          <p>{task.descricao}</p>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail
