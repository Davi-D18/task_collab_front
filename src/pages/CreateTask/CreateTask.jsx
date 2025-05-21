import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../../components/Toast/ToastContainer"
import { taskService } from "../../services/api"
import { substituirEspacosPorUnderline } from "../../utils/stringUtils"
import Button from "../../components/UI/Button"
import Card from "../../components/UI/Card"
import SelectField from "../../components/FormControls/SelectField"
import DateField from "../../components/FormControls/DateField"
import TextareaField from "../../components/FormControls/TextareaField"
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

    if (!title || !deadline) {
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
        usuario: substituirEspacosPorUnderline(user.username),
        titulo: title,
        descricao: description,
        prioridade: priority,
        status: status,
        prazo: deadline
      }

      await taskService.create(data)

      toast({
        title: "Tarefa criada",
        description: "Sua tarefa foi criada com sucesso.",
      })

      navigate("/")
    } catch (error) {
      console.error("Erro ao criar tarefa:", error.response?.data);
      
      // Verifica se há erros específicos de campo retornados pela API
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = errors.map(err => `${err.field}: ${err.message}`).join(', ');
        
        toast({
          title: error.response.data.title || "Erro ao criar tarefa",
          description: errorMessages || "Não foi possível criar sua tarefa. Tente novamente mais tarde.",
          type: "destructive",
        });
      } else {
        toast({
          title: "Erro ao criar tarefa",
          description: error.response?.data?.detail || "Não foi possível criar sua tarefa. Tente novamente mais tarde.",
          type: "destructive",
        });
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.createTask}>
      <Card>
        <Card.Header>
          <Card.Title>Criar Nova Tarefa</Card.Title>
        </Card.Header>
        
        <p className={styles.subtitle}>Crie uma nova tarefa.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Título <span className={styles.requiredField}>*</span>
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
            <TextareaField
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles.controlsRow}>
            <DateField
              id="deadline"
              label={<>Prazo <span className={styles.requiredField}>*</span></>}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={loading}
            />

            <SelectField
              id="priority"
              label="Prioridade"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}
              options={[
                { value: "B", label: "Baixa" },
                { value: "M", label: "Média" },
                { value: "A", label: "Alta" }
              ]}
            />

            <SelectField
              id="status"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
              options={[
                { value: "P", label: "Pendente" },
                { value: "EA", label: "Em Andamento" },
                { value: "C", label: "Concluída" }
              ]}
            />
          </div>

          <div className={styles.actions}>
            <Button 
              variant="back" 
              onClick={() => navigate("/")} 
              disabled={loading}
              type="button"
            >
              Cancelar
            </Button>
            <Button 
              variant="create" 
              disabled={loading}
              type="submit"
            >
              {loading ? "Criando..." : "Criar Tarefa"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default CreateTask