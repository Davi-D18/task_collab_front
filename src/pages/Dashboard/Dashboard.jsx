import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { memoryService } from "../../services/api"
import { useToast } from "../../components/Toast/ToastContainer"
import MemoryCard from "../../components/MemoryCard/MemoryCard"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import { Plus, Clock } from "lucide-react"
import styles from "./Dashboard.module.scss"

const Dashboard = () => {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchMemories()
  }, [])

  const fetchMemories = async () => {
    try {
      setLoading(true)
      const response = await memoryService.getAll()
      setMemories(response.data)
    } catch (error) {
      toast({
        title: "Erro ao carregar memórias",
        description: "Não foi possível carregar suas memórias. Tente novamente mais tarde.",
        type: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await memoryService.delete(id)
      setMemories(memories.filter((memory) => memory.id !== id))
      toast({
        title: "Memória excluída",
        description: "Sua memória foi excluída com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir memória",
        description: "Não foi possível excluir sua memória. Tente novamente mais tarde.",
        type: "destructive",
      })
    }
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Suas Memórias</h1>
        <Link to="/create" className={styles.createButton}>
          <Plus size={20} />
          <span>Nova Memória</span>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : memories.length > 0 ? (
        <div className={styles.memoriesGrid}>
          {memories.map((memory) => (
            <div key={memory.id} className={styles.memoryItem}>
              <MemoryCard memory={memory} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Clock size={64} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>Nenhuma memória desbloqueada</h2>
          <p className={styles.emptyText}>Você ainda não tem memórias desbloqueadas ou não criou nenhuma memória.</p>
          <Link to="/create" className={styles.emptyButton}>
            Criar Primeira Memória
          </Link>
        </div>
      )}
    </div>
  )
}

export default Dashboard
