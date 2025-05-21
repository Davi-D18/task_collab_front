import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import { useToast } from "../../components/Toast/ToastContainer"
import { taskService } from "../../services/api"
import { substituirEspacosPorUnderline } from "../../utils/stringUtils"
import { statusMap, prioridadeMap } from "../../utils/taskUtils"
import Button from "../../components/UI/Button"
import Card from "../../components/UI/Card"
import TaskHeader from "../../components/Task/TaskHeader"
import TaskMetadata from "../../components/Task/TaskMetadata"
import TaskDescription from "../../components/Task/TaskDescription"
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

  useEffect(() => {
    if (id) {
      fetchTask()
    }
  }, [id])

  const fetchTask = async () => {
    try {
      setLoading(true)
      const response = await taskService.getById(id)
      
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

  if (loading) {
    return <LoadingSpinner />
  }

  if (!task) {
    return (
      <div className={styles.taskDetail}>
        <Button variant="back" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          <span>Voltar</span>
        </Button>
        <Card>
          <h2>Tarefa não encontrada</h2>
        </Card>
      </div>
    )
  }

  return (
    <div className={styles.taskDetail}>
      <Button variant="back" onClick={() => navigate("/")}>
        <ArrowLeft size={18} />
        <span>Voltar</span>
      </Button>

      <Card>
        <TaskHeader 
          title={task.titulo}
          editedTitle={editedTitle}
          editing={editingTitle}
          onEdit={() => setEditingTitle(true)}
          onChange={(e) => setEditedTitle(e.target.value)}
          onSave={() => {
            handleUpdateTask("titulo", editedTitle);
            setEditingTitle(false);
          }}
          onDelete={handleDelete}
          deleting={deleting}
        />

        <TaskMetadata 
          task={task}
          onUpdateTask={handleUpdateTask}
          updating={updating}
        />

        <TaskDescription 
          description={task.descricao}
          editedDescription={editedDescription}
          editing={editingDescription}
          updating={updating}
          onEdit={() => setEditingDescription(true)}
          onChange={(e) => setEditedDescription(e.target.value)}
          onSave={() => {
            handleUpdateTask("descricao", editedDescription);
            setEditingDescription(false);
          }}
        />
      </Card>
    </div>
  )
}

export default TaskDetail