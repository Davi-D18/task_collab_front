import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../../components/Toast/ToastContainer"
import { taskService } from "../../services/api"
import styles from "./CreateTask.module.scss"

const CreateTask = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("M")
  const [status, setStatus] = useState("P")
  const [deadline, setDeadline] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !description || !deadline) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        type: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const storedData = localStorage.getItem('@TaskCollab:user')
      const user = JSON.parse(storedData)

      const data = {
        usuario: user.username,
        titulo: title,
        descricao: description,
        prioridade: priority,
        status: status,
        prazo: deadline
      }

      console.log(data)

      await taskService.create(data)

      toast({
        title: "Tarefa criada",
        description: "Sua tarefa foi criada com sucesso.",
      })

      navigate("/")
    } catch (error) {
      toast({
        title: "Erro ao criar tarefa",
        description: error.response?.data?.detail || "Não foi possível criar sua tarefa. Tente novamente mais tarde.",
        type: "destructive",
      })
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.createTask}>
      <h1 className={styles.title}>Criar Nova Tarefa</h1>
      <p className={styles.subtitle}>Crie uma nova tarefa para o TaskCollab Solutions.</p>

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
              placeholder="Dê um título para sua tarefa"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              placeholder="Descreva sua tarefa aqui..."
              rows={8}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="deadline" className={styles.label}>
              Prazo
            </label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="priority" className={styles.label}>
              Prioridade
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={styles.select}
              required
            >
              <option value="B">Baixa</option>
              <option value="M">Média</option>
              <option value="A">Alta</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.label}>
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={styles.select}
              required
            >
              <option value="P">Pendente</option>
              <option value="EA">Em Andamento</option>
              <option value="C">Concluída</option>
            </select>
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

export default CreateTask
