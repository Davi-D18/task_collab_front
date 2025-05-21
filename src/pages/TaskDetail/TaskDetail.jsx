import { AlertCircle, ArrowLeft, Calendar, CheckCircle2, Clock, Edit2, Save, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import { useToast } from "../../components/Toast/ToastContainer"
import { taskService } from "../../services/api"
import { formatDate } from "../../utils/formatDate"
import { substituirEspacosPorUnderline } from "../../utils/stringUtils"
import styles from "./TaskDetail.module.scss"

const TaskDetail = () => {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDescription, setEditingDescription] = useState(false)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedDescription, setEditedDescription] = useState("")
  const navigate = useNavigate()
  const { toast } = useToast()

  // Mapeamento de valores para o backend
  const statusMap = {
    "Pendente": "P",
    "Em Andamento": "EA",
    "Concluída": "C"
  }

  const prioridadeMap = {
    "Baixa": "B",
    "Media": "M",
    "Alta": "A"
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
      
      // Garantir que o status seja mantido como está na API
      const taskData = response.data
      
      setTask(taskData)
      setEditedTitle(taskData.titulo)
      setEditedDescription(taskData.descricao)
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

  const handleUpdateTask = async (field, value) => {
    try {
      setUpdating(true)
      const storedData = localStorage.getItem('@TaskCollab:user')
      const user = JSON.parse(storedData)

      // Cria uma cópia completa da tarefa atual
      const updatedTask = {
        titulo: field === "titulo" ? value : task.titulo,
        descricao: field === "descricao" ? value : task.descricao,
        prazo: field === "prazo" ? value : task.prazo,
        status: field === "status" ? value : statusMap[task.status_display] || "P",
        prioridade: field === "prioridade" ? value : prioridadeMap[task.prioridade_display] || "B",
        usuario: substituirEspacosPorUnderline(user.username)
      }

      await taskService.update(id, updatedTask)
      
      // Atualiza o estado local com a nova resposta do backend
      await fetchTask()

      toast({
        title: "Tarefa atualizada",
        description: "As alterações foram salvas com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      
      // Verifica se há erros específicos de campo retornados pela API
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = errors.map(err => `${err.field}: ${err.message}`).join(', ');
        
        toast({
          title: error.response.data.title || "Erro ao atualizar tarefa",
          description: errorMessages || "Não foi possível atualizar sua tarefa. Tente novamente mais tarde.",
          type: "destructive",
        })
      } else {
        toast({
          title: "Erro ao atualizar tarefa",
          description: "Não foi possível atualizar sua tarefa. Tente novamente mais tarde.",
          type: "destructive",
        })
      }
    } finally {
      setUpdating(false)
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "C":
      case "concluida":
      case "Concluída":
        return <CheckCircle2 size={16} color="#10b981" />
      case "EA":
      case "em_andamento":
      case "Em Andamento":
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
          <div className={styles.title}>
            {editingTitle ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={() => {
                  handleUpdateTask("titulo", editedTitle);
                  setEditingTitle(false);
                }}
                autoFocus
              />
            ) : (
              <>
                {task.titulo}
                <button 
                  className={styles.editButton} 
                  onClick={() => setEditingTitle(true)}
                >
                  <Edit2 size={14} />
                </button>
              </>
            )}
          </div>
          <button onClick={handleDelete} className={styles.deleteButton} disabled={deleting}>
            <Trash2 size={18} />
            <span>Excluir</span>
          </button>
        </div>

        <div className={styles.metadataContainer}>
          <div className={styles.datesInfo}>
            <div className={styles.dateItem}>
              <Clock size={16} />
              <span>Criada em {formatDate(task.criado_em)}</span>
            </div>
            
            {task.atualizado_em && (
              <div className={styles.dateItem}>
                <Edit2 size={16} />
                <span>Atualizada em {formatDate(task.atualizado_em)}</span>
              </div>
            )}
            
            {task.concluido_em && (
              <div className={styles.dateItem}>
                <CheckCircle2 size={16} />
                <span>Concluída em {formatDate(task.concluido_em)}</span>
              </div>
            )}
          </div>
          
          <div className={styles.controlsRow}>
            <div className={styles.metaItem}>
              <label htmlFor="priority" className={styles.label}>
                Prioridade:
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="priority"
                  value={prioridadeMap[task.prioridade_display] || "B"}
                  onChange={(e) => handleUpdateTask("prioridade", e.target.value)}
                  className={styles.select}
                  style={getPriorityColor(task.prioridade_display)}
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
                {getStatusIcon(task.status_display)}
                <select
                  id="status"
                  value={statusMap[task.status_display] || "P"}
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
            
            <div className={styles.metaItem}>
              <label htmlFor="prazo" className={styles.label}>
                Prazo:
              </label>
              <div className={styles.selectWrapper}>
                <Calendar size={16} />
                <input
                  id="prazo"
                  type="date"
                  value={task.prazo || ""}
                  onChange={(e) => handleUpdateTask("prazo", e.target.value)}
                  className={styles.dateInput}
                  disabled={updating}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <h3>
            Descrição
            {!editingDescription ? (
              <button 
                className={styles.editButton} 
                onClick={() => setEditingDescription(true)}
              >
                <Edit2 size={14} />
                <span>Editar</span>
              </button>
            ) : (
              <button 
                className={styles.saveButton} 
                onClick={() => {
                  handleUpdateTask("descricao", editedDescription);
                  setEditingDescription(false);
                }}
                disabled={updating}
              >
                <Save size={14} />
                <span>Salvar</span>
              </button>
            )}
          </h3>
          
          {editingDescription ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              disabled={updating}
              autoFocus
            />
          ) : (
            <p>{task.descricao}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskDetail
