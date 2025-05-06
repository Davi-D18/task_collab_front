import { useState } from "react"
import { Link } from "react-router-dom"
import { Clock, Trash2, Lock } from "lucide-react"
import { formatDate } from "../../utils/formatDate"
import styles from "./MemoryCard.module.scss"

const MemoryCard = ({ memory, onDelete, publicMemory }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (window.confirm("Tem certeza que deseja excluir esta memória?")) {
      setIsDeleting(true)
      try {
        await onDelete(memory.id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const hoje = new Date()       
  const dataDesbloqueio = new Date(memory.unlock_date)

  const isUnlocked = hoje >= dataDesbloqueio

  return (
    <>
      {isUnlocked ? (
      <Link to={`/memories/${memory.id}`} className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{memory.title}</h3>
        {publicMemory ? (
          ""
        ): (
          <button onClick={handleDelete} className={styles.deleteButton} disabled={isDeleting}>
          <Trash2 size={18} />
        </button>
        )}
      </div>
      <p className={styles.content}>
        {(
          memory?.content ?? ""
        ).length > 150
          ? `${memory.content.substring(0, 150)}...`
          : memory.content
        }
      </p>
      <div className={styles.footer}>
        <div className={styles.date}>
          <Clock size={14} />
          <span>Criada em {formatDate(memory.created_at)}</span>
        </div>
          {hoje >= formatDate(memory.unlock_date) ? (
            <div className={styles.unlockDate}>
              Desbloqueada em {formatDate(memory.unlock_date)}
            </div>
          ) : (
            <div className={styles.lockDate}>
              Desbloqueia em {formatDate(memory.unlock_date)}
            </div>
          )}
      </div>
    </Link>
    ) : (
      <div className={styles.cardlock}>
        <Lock size={20} strokeWidth={1.5} />
        <div className={styles.header}>
          <h3 className={styles.title}>{memory.title}</h3>
          {publicMemory ? (
          ""
          ): (
            <button onClick={handleDelete} className={styles.deleteButton} disabled={isDeleting}>
            <Trash2 size={18} />
          </button>
          )}
        </div>
        <p className={styles.content}>
          {(
            memory?.content ?? ""
          ).length > 150
            ? `${memory.content.substring(0, 150)}...`
            : memory.content
          }
        </p>
        <div className={styles.footer}>
          <div className={styles.date}>
            <Clock size={14} />
            <span>Criada em {formatDate(memory.created_at)}</span>
          </div>
            {hoje >= formatDate(memory.unlock_date) ? (
              <div className={styles.unlockDate}>
                Desbloqueada em {formatDate(memory.unlock_date)}
              </div>
            ) : (
              <div className={styles.lockDate}>
                Desbloqueia em {formatDate(memory.unlock_date)}
              </div>
            )}
        </div>
      </div>
    )}
    </>
  )
}

export default MemoryCard
