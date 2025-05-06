import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { memoryService } from "../../services/api"
import { useToast } from "../../components/Toast/ToastContainer"
import { formatDate } from "../../utils/formatDate"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import { ArrowLeft, Clock, Calendar, Trash2 } from "lucide-react"
import styles from "./MemoryDetail.module.scss"

const MemoryDetail = () => {
  const { id } = useParams()
  const [memory, setMemory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    fetchMemory()
  }, [id])

  const fetchMemory = async () => {
    try {
      setLoading(true)
      const response = await memoryService.getById(id)
      console.log(response.data)
      setMemory(response.data)
    } catch (error) {
      toast({
        title: "Erro ao carregar memória",
        description:
          error.response?.status === 404
            ? "Memória não encontrada ou ainda não desbloqueada."
            : "Não foi possível carregar a memória. Tente novamente mais tarde.",
        type: "destructive",
      })
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta memória?")) {
      try {
        setDeleting(true)
        await memoryService.delete(id)
        toast({
          title: "Memória excluída",
          description: "Sua memória foi excluída com sucesso.",
        })
        navigate("/")
      } catch (error) {
        toast({
          title: "Erro ao excluir memória",
          description: "Não foi possível excluir sua memória. Tente novamente mais tarde.",
          type: "destructive",
        })
        setDeleting(false)
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className={styles.memoryDetail}>
      <button onClick={() => navigate("/")} className={styles.backButton}>
        <ArrowLeft size={18} />
        <span>Voltar</span>
      </button>

      <div className={styles.memoryCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>{memory.title}</h1>
          <button onClick={handleDelete} className={styles.deleteButton} disabled={deleting}>
            <Trash2 size={18} />
            <span>Excluir</span>
          </button>
        </div>

        <div className={styles.metadata}>
          <div className={styles.metaItem}>
            <Clock size={16} />
            <span>Criada em {formatDate(memory.created_at)}</span>
          </div>
          <div className={styles.metaItem}>
            <Calendar size={16} />
            {memory.unlock_date ? (
              <span>Desbloqueada em: {formatDate(memory.unlock_date)}</span>
            ): (
              <span>Desbloqueia em {formatDate(memory.unlock)}</span>
            )}
          </div>
        </div>

        <div className={styles.content}>
        {(memory?.content ?? "")
          .split("\n")
          .map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))
        }
        </div>
      </div>
    </div>
  )
}

export default MemoryDetail
