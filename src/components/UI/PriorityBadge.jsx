import React from 'react';
import { getPriorityColor } from '../../utils/taskUtils';

/**
 * Componente para exibir a prioridade de uma tarefa como um badge
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.priority - Prioridade da tarefa
 */
const PriorityBadge = ({ priority }) => {
  const style = getPriorityColor(priority);
  
  return (
    <span style={style}>
      {priority || "Normal"}
    </span>
  );
};

export default PriorityBadge;