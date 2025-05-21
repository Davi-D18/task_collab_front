import { Clock, Filter, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import TaskCard from "../../components/TaskCard/TaskCard"
import { useToast } from "../../components/Toast/ToastContainer"
import { taskService } from "../../services/api"
import FilterGroup from "../../components/Filters/FilterGroup"
import FilterButton from "../../components/Filters/FilterButton"
import styles from "./Dashboard.module.scss"

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeStatusFilter, setActiveStatusFilter] = useState("all")
  const [activePriorityFilter, setActivePriorityFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchTasks()
  }, [])
  
  useEffect(() => {
    if (tasks.length > 0) {
      applyFilters()
    } else {
      setFilteredTasks([])
    }
  }, [tasks, activeStatusFilter, activePriorityFilter])
  
  const applyFilters = () => {
    let filtered = [...tasks]
    
    // Aplicar filtro de status
    if (activeStatusFilter !== "all") {
      switch (activeStatusFilter) {
        case "pending":
          filtered = filtered.filter(task => task.status_display === "Pendente")
          break
        case "inProgress":
          filtered = filtered.filter(task => task.status_display === "Em Andamento")
          break
        case "completed":
          filtered = filtered.filter(task => task.status_display === "Concluída")
          break
      }
    }
    
    // Aplicar filtro de prioridade
    if (activePriorityFilter !== "all") {
      switch (activePriorityFilter) {
        case "high":
          filtered = filtered.filter(task => task.prioridade_display === "Alta")
          break
        case "medium":
          filtered = filtered.filter(task => task.prioridade_display === "Media")
          break
        case "low":
          filtered = filtered.filter(task => task.prioridade_display === "Baixa")
          break
      }
    }
    
    setFilteredTasks(filtered)
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await taskService.getAll()
      setTasks(response.data)
    } catch (error) {
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
        <FilterGroup 
          label="Filtrar por Status:" 
          icon={<Filter size={16} />}
        >
          <FilterButton 
            label="Todos" 
            active={activeStatusFilter === 'all'} 
            onClick={() => setActiveStatusFilter('all')} 
          />
          <FilterButton 
            label="Pendentes" 
            active={activeStatusFilter === 'pending'} 
            onClick={() => setActiveStatusFilter('pending')} 
          />
          <FilterButton 
            label="Em Andamento" 
            active={activeStatusFilter === 'inProgress'} 
            onClick={() => setActiveStatusFilter('inProgress')} 
          />
          <FilterButton 
            label="Concluídas" 
            active={activeStatusFilter === 'completed'} 
            onClick={() => setActiveStatusFilter('completed')} 
          />
        </FilterGroup>
        
        <FilterGroup 
          label="Filtrar por Prioridade:" 
          icon={<Filter size={16} />}
        >
          <FilterButton 
            label="Todas" 
            active={activePriorityFilter === 'all'} 
            onClick={() => setActivePriorityFilter('all')} 
          />
          <FilterButton 
            label="Alta" 
            active={activePriorityFilter === 'high'} 
            onClick={() => setActivePriorityFilter('high')} 
          />
          <FilterButton 
            label="Média" 
            active={activePriorityFilter === 'medium'} 
            onClick={() => setActivePriorityFilter('medium')} 
          />
          <FilterButton 
            label="Baixa" 
            active={activePriorityFilter === 'low'} 
            onClick={() => setActivePriorityFilter('low')} 
          />
        </FilterGroup>
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