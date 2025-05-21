import React from 'react';
import { AlertCircle, Calendar, CheckCircle2, Clock, Edit2 } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import { getPriorityColor, prioridadeMap, statusMap, getStatusInfo } from '../../utils/taskUtils';
import styles from '../../styles/layout.module.scss';

/**
 * Componente para exibir e editar metadados de uma tarefa
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.task - Dados da tarefa
 * @param {Function} props.onUpdateTask - Função para atualizar a tarefa
 * @param {boolean} props.updating - Se está atualizando a tarefa
 */
const TaskMetadata = ({ task, onUpdateTask, updating }) => {
  if (!task) return null;

  // Renderiza o ícone apropriado com base no tipo
  const renderStatusIcon = () => {
    const statusInfo = getStatusInfo(task.status_display);
    switch (statusInfo.iconType) {
      case 'CheckCircle2':
        return <CheckCircle2 size={16} color="#10b981" />;
      case 'AlertCircle':
        return <AlertCircle size={16} color="#f59e0b" />;
      case 'Clock':
      default:
        return <Clock size={16} color="#6b7280" />;
    }
  };

  return (
    <div className={styles.metadataContainer}>
      <div className={styles.datesInfo}>
        <div className={styles.dateItem}>
          <Clock size={16} />
          <span>Criada em {formatDate(task.criado_em)}</span>
        </div>
        
        {task.atualizado_em && (
          <div className={styles.dateItem}>
            <Edit2 size={16} />
            <span>Atualizada em {formatDate(task.atualizado_em)}</span>
          </div>
        )}
        
        {task.concluido_em && (
          <div className={styles.dateItem}>
            <CheckCircle2 size={16} />
            <span>Concluída em {formatDate(task.concluido_em)}</span>
          </div>
        )}
      </div>
      
      <div className={styles.flexRow}>
        <div className={styles.metaItem}>
          <label htmlFor="priority" className={styles.label}>
            Prioridade:
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="priority"
              value={prioridadeMap[task.prioridade_display] || "B"}
              onChange={(e) => onUpdateTask("prioridade", e.target.value)}
              className={styles.select}
              style={getPriorityColor(task.prioridade_display)}
              disabled={updating}
            >
              <option value="B">Baixa</option>
              <option value="M">Média</option>
              <option value="A">Alta</option>
            </select>
          </div>
        </div>

        <div className={styles.metaItem}>
          <label htmlFor="status" className={styles.label}>
            Status:
          </label>
          <div className={styles.selectWrapper}>
            {renderStatusIcon()}
            <select
              id="status"
              value={statusMap[task.status_display] || "P"}
              onChange={(e) => onUpdateTask("status", e.target.value)}
              className={styles.select}
              disabled={updating}
            >
              <option value="P">Pendente</option>
              <option value="EA">Em Andamento</option>
              <option value="C">Concluída</option>
            </select>
          </div>
        </div>
        
        <div className={styles.metaItem}>
          <label htmlFor="prazo" className={styles.label}>
            Prazo:
          </label>
          <div className={styles.selectWrapper}>
            <Calendar size={16} />
            <input
              id="prazo"
              type="date"
              value={task.prazo || ""}
              onChange={(e) => onUpdateTask("prazo", e.target.value)}
              className={styles.dateInput}
              disabled={updating}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskMetadata;