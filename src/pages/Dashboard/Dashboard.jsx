import { CheckCircle2, Clock, Filter, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import TaskCard from "../../components/TaskCard/TaskCard"
import { useToast } from "../../components/Toast/ToastContainer"
import { taskService } from "../../services/api"
import styles from "./Dashboard.module.scss"

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchTasks()
  }, [])
  
  useEffect(() => {
    if (tasks.length > 0) {
      filterTasks(activeFilter)
    } else {
      setFilteredTasks([])
    }
  }, [tasks, activeFilter])
  
  const filterTasks = (filter) => {
    switch (filter) {
      case "pending":
        setFilteredTasks(tasks.filter(task => task.status_display === "Pendente"))
        break
      case "inProgress":
        setFilteredTasks(tasks.filter(task => task.status_display === "Em Andamento"))
        break
      case "completed":
        setFilteredTasks(tasks.filter(task => task.status_display === "Concluída"))
        break
      default:
        setFilteredTasks(tasks)
    }
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await taskService.getAll()
      console.log('Tarefas recebidas:', response.data)
      setTasks(response.data)
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error)
      
      // Verifica se há erros específicos retornados pela API
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = errors.map(err => `${err.field}: ${err.message}`).join(', ');
        
        toast({
          title: error.response.data.title || "Erro ao carregar tarefas",
          description: errorMessages || "Não foi possível carregar suas tarefas. Tente novamente mais tarde.",
          type: "destructive",
        })
      } else {
        toast({
          title: "Erro ao carregar tarefas",
          description: "Não foi possível carregar suas tarefas. Tente novamente mais tarde.",
          type: "destructive",
        })
      }
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
      // Verifica se há erros específicos de campo retornados pela API
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = errors.map(err => `${err.field}: ${err.message}`).join(', ');
        
        toast({
          title: error.response.data.title || "Erro ao excluir tarefa",
          description: errorMessages || "Não foi possível excluir sua tarefa. Tente novamente mais tarde.",
          type: "destructive",
        })
      } else {
        toast({
          title: "Erro ao excluir tarefa",
          description: "Não foi possível excluir sua tarefa. Tente novamente mais tarde.",
          type: "destructive",
        })
      }
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

      <div className={styles.filterContainer}>
        <div className={styles.filterLabel}>
          <Filter size={16} />
          <span>Filtrar por:</span>
        </div>
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Todas
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'pending' ? styles.active : ''}`}
            onClick={() => setActiveFilter('pending')}
          >
            Pendentes
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'inProgress' ? styles.active : ''}`}
            onClick={() => setActiveFilter('inProgress')}
          >
            Em Andamento
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'completed' ? styles.active : ''}`}
            onClick={() => setActiveFilter('completed')}
          >
            Concluídas
          </button>
        </div>
      </div>
      
      {loading ? (
        <LoadingSpinner />
      ) : tasks.length > 0 ? (
        <div className={styles.tasksGrid}>
          {filteredTasks.map((task) => (
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
