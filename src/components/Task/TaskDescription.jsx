import { Edit2, Save } from "lucide-react";
import styles from "../../styles/layout.module.scss";
import TextareaField from "../FormControls/TextareaField";
import Button from "../UI/Button";

/**
 * Componente para exibir e editar a descrição de uma tarefa
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} props.description - Descrição atual da tarefa
 * @param {string} props.editedDescription - Descrição editada
 * @param {boolean} props.editing - Se está em modo de edição
 * @param {boolean} props.updating - Se está atualizando a tarefa
 * @param {Function} props.onEdit - Função para iniciar edição
 * @param {Function} props.onSave - Função para salvar alterações
 * @param {Function} props.onChange - Função para atualizar descrição editada
 */
const TaskDescription = ({
  description,
  editedDescription,
  editing,
  updating,
  onEdit,
  onSave,
  onChange,
}) => {
  return (
    <div className={styles.contentSection}>
      <h3 className={styles.sectionHeader}>
        Descrição
        {!editing ? (
          <Button variant="edit" onClick={onEdit}>
            <Edit2 size={14} />
            <span>Editar</span>
          </Button>
        ) : (
          <Button variant="save" onClick={onSave} disabled={updating}>
            <Save size={14} />
            <span>Salvar</span>
          </Button>
        )}
      </h3>

      {editing ? (
        <TextareaField
          id="description"
          value={editedDescription}
          onChange={onChange}
          disabled={updating}
          autoFocus
        />
      ) : (
        <p className={styles.descriptionText}>{description}</p>
      )}
    </div>
  );
};

export default TaskDescription;
