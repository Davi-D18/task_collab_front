import { Clock, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import TaskCard from "../../components/TaskCard/TaskCard"
import { useToast } from "../../components/Toast/ToastContainer"
import { taskService } from "../../services/api"
import styles from "./Dashboard.module.scss"

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await taskService.getAll()
      setTasks(response.data)
    } catch (error) {
      toast({
        title: "Erro ao carregar tarefas",
        description: "Não foi possível carregar suas tarefas. Tente novamente mais tarde.",
        type: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await taskService.delete(id)
      setTasks(tasks.filter((task) => task.id !== id))
      toast({
        title: "Tarefa excluída",
        description: "Sua tarefa foi excluída com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir tarefa",
        description: "Não foi possível excluir sua tarefa. Tente novamente mais tarde.",
        type: "destructive",
      })
    }
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Suas Tarefas</h1>
        <Link to="/create" className={styles.createButton}>
          <Plus size={20} />
          <span>Nova Tarefa</span>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : tasks.length > 0 ? (
        <div className={styles.tasksGrid}>
          {tasks.map((task) => (
            <div key={task.id} className={styles.taskItem}>
              <TaskCard task={task} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Clock size={64} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>Nenhuma tarefa encontrada</h2>
          <p className={styles.emptyText}>Você ainda não tem tarefas cadastradas.</p>
          <Link to="/create" className={styles.emptyButton}>
            Criar Primeira Tarefa
          </Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard
