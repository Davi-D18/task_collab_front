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
  const [updating, setUpdating] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  // Mapeamento de valores para o backend
  const statusMap = {
    "Pendente": "P",
    "Em Andamento": "EA",
    "Concluida": "C"
  }

  const prioridadeMap = {
    "Baixa": "B",
    "Media": "M",
    "Alta": "A"
  }

  // Mapeamento inverso para exibição
  const statusDisplayMap = {
    "P": "Pendente",
    "EA": "Em Andamento",
    "C": "Concluida"
  }

  const prioridadeDisplayMap = {
    "B": "Baixa",
    "M": "Media",
    "A": "Alta"
  }

  useEffect(() => {
    if (id) {
      fetchTask()
    }
  }, [id])

  const fetchTask = async () => {
    try {
      setLoading(true)
      const response = await taskService.getById(id)
      console.log('Dados recebidos da API:', response.data)
      
      // Mapeia os campos de display para os valores internos
      const taskData = {
        ...response.data,
        status: statusMap[response.data.status_display] || "P",
        prioridade: prioridadeMap[response.data.prioridade_display] || "B"
      }

      console.log('Dados mapeados:', taskData)
      setTask(taskData)
    } catch (error) {
      console.error('Erro ao buscar task:', error)
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

  const handleUpdateTask = async (field, value) => {
    try {
      setUpdating(true)
      const storedData = localStorage.getItem('@TaskCollab:user')
      const user = JSON.parse(storedData)

      // Prepara os dados para envio com apenas os campos necessários
      const dataToUpdate = {
        titulo: task.titulo,
        descricao: task.descricao,
        prazo: task.prazo,
        criado_em: task.criado_em,
        usuario: user.username,
        [field]: value
      }

      console.log('Dados para atualização:', dataToUpdate)
      await taskService.update(id, dataToUpdate)
      
      // Atualiza o estado local com a nova resposta do backend
      await fetchTask()

      toast({
        title: "Tarefa atualizada",
        description: "As alterações foram salvas com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      toast({
        title: "Erro ao atualizar tarefa",
        description: "Não foi possível atualizar sua tarefa. Tente novamente mais tarde.",
        type: "destructive",
      })
    } finally {
      setUpdating(false)
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "C":
        return <CheckCircle2 size={16} color="#10b981" />
      case "EA":
        return <AlertCircle size={16} color="#f59e0b" />
      default:
        return <Clock size={16} color="#6b7280" />
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!task) {
    return (
      <div className={styles.taskDetail}>
        <button onClick={() => navigate("/")} className={styles.backButton}>
          <ArrowLeft size={18} />
          <span>Voltar</span>
        </button>
        <div className={styles.taskCard}>
          <h2>Tarefa não encontrada</h2>
        </div>
      </div>
    )
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
          
          <div className={styles.metaItem}>
            <label htmlFor="priority" className={styles.label}>
              Prioridade:
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="priority"
                value={task.prioridade}
                onChange={(e) => handleUpdateTask("prioridade", e.target.value)}
                className={styles.select}
                style={{ color: getPriorityColor(task.prioridade_display) }}
                disabled={updating}
              >
                <option value="B">Baixa</option>
                <option value="M">Média</option>
                <option value="A">Alta</option>
              </select>
            </div>
          </div>

          <div className={styles.metaItem}>
            <label htmlFor="status" className={styles.label}>
              Status:
            </label>
            <div className={styles.selectWrapper}>
              {getStatusIcon(task.status)}
              <select
                id="status"
                value={task.status}
                onChange={(e) => handleUpdateTask("status", e.target.value)}
                className={styles.select}
                disabled={updating}
              >
                <option value="P">Pendente</option>
                <option value="EA">Em Andamento</option>
                <option value="C">Concluída</option>
              </select>
            </div>
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
