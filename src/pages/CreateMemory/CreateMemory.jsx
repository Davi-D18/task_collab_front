import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { memoryService } from "../../services/api"
import { useToast } from "../../components/Toast/ToastContainer"
import { Calendar } from "lucide-react"
import styles from "./CreateMemory.module.scss"

const CreateMemory = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [unlockDate, setUnlockDate] = useState("")
  const [memoryPublic, setMemoryPublic] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  // Calcula a data mínima (amanhã)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !content || !unlockDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        type: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const storedData = localStorage.getItem('@TimeCapsule:user')

      // Converter de string para objeto
      const username = JSON.parse(storedData);

      await memoryService.create({
        owner: username.email,
        title,
        content,
        unlock_date: unlockDate,
        is_public: memoryPublic,   
      })

      toast({
        title: "Memória criada",
        description: "Sua memória foi criada com sucesso e será desbloqueada na data definida.",
      })

      navigate("/")
    } catch (error) {
      toast({
        title: "Erro ao criar memória",
        description: error.response?.data?.detail || "Não foi possível criar sua memória. Tente novamente mais tarde.",
        type: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.createMemory}>
      <h1 className={styles.title}>Criar Nova Memória</h1>
      <p className={styles.subtitle}>Crie uma memória que só poderá ser acessada após a data de desbloqueio.</p>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Título
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              placeholder="Dê um título para sua memória"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content" className={styles.label}>
              Descrição
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textarea}
              placeholder="Escreva sua memória aqui..."
              rows={8}
              required
            />
          </div>

          <div className={styles.checkbox_wrapper_46}>
            <input type="checkbox"
              id="cbx-46" 
              className={styles.inp_cbx} 
              checked={memoryPublic}                                  
              onChange={(e) => setMemoryPublic(e.target.checked)} />

            <label htmlFor="cbx-46" className={styles.cbx}
              ><span>
                <svg viewBox="0 0 12 10" height="10px" width="12px">
                  <polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span
              ><span>Memória pública?</span>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="unlockDate" className={styles.label}>
              Prazo
              <span className={styles.labelHint}>(A memória só poderá ser acessada após esta data)</span>
            </label>
            <div className={styles.dateInputWrapper}>
              <Calendar size={18} className={styles.dateIcon} />
              <input
                id="unlockDate"
                type="date"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                className={styles.dateInput}
                min={minDate}
                required
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={() => navigate("/")} className={styles.cancelButton} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? "Criando..." : "Criar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMemory
