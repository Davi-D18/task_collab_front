import { useState, useEffect } from "react"
import { memoryService } from "../../services/api"
import { useToast } from "../../components/Toast/ToastContainer"
import MemoryCard from "../../components/MemoryCard/MemoryCard"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import { Clock } from "lucide-react"
import styles from "./MemoriesPublics.module.scss"

const MemoriesPublics = () => {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchMemories()
  }, [])

  const fetchMemories = async () => {
    try {
      setLoading(true)
      const response = await memoryService.getAllPublics()
      setMemories(response.data)
    } catch (error) {
      toast({
        title: "Erro ao carregar memórias",
        description: "Não foi possível carregar as memórias públicas. Tente novamente mais tarde.",
        type: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Memórias Públicas</h1>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : memories.length > 0 ? (
        <div className={styles.memoriesGrid}>
          {memories.map((memory) => (
            <div key={memory.id} className={styles.memoryItem}>
              <MemoryCard memory={memory} publicMemory={true}/>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Clock size={64} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>Nenhuma memória pública</h2>
          <p className={styles.emptyText}>Ainda não tem memórias públicas :(.</p>
        </div>
      )}
    </div>
  )
}

export default MemoriesPublics
