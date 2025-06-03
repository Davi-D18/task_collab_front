import { Edit2, Trash2 } from "lucide-react";
import styles from "../../styles/layout.module.scss";
import Button from "../UI/Button";

/**
 * Componente para o cabeçalho de uma tarefa
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} props.title - Título da tarefa
 * @param {string} props.editedTitle - Título editado
 * @param {boolean} props.editing - Se está em modo de edição
 * @param {Function} props.onEdit - Função para iniciar edição
 * @param {Function} props.onChange - Função para atualizar título editado
 * @param {Function} props.onSave - Função para salvar alterações
 * @param {Function} props.onDelete - Função para excluir tarefa
 * @param {boolean} props.deleting - Se está excluindo a tarefa
 */
const TaskHeader = ({
  title,
  editedTitle,
  editing,
  onEdit,
  onChange,
  onSave,
  onDelete,
  deleting,
}) => {
  return (
    <div className={styles.cardHeader}>
      <div className={styles.cardTitle}>
        {editing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={onChange}
            onBlur={onSave}
            autoFocus
            className={styles.titleInput}
          />
        ) : (
          <>
            {title}
            <button className={styles.editButton} onClick={onEdit}>
              <Edit2 size={14} />
            </button>
          </>
        )}
      </div>
      <Button variant="delete" onClick={onDelete} disabled={deleting}>
        <Trash2 size={18} />
        <span>Excluir</span>
      </Button>
    </div>
  );
};

export default TaskHeader;
