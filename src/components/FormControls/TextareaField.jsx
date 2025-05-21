import React from 'react';
import styles from '../../styles/forms.module.scss';

/**
 * Componente reutilizável para campos de texto multilinha
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.id - ID do campo
 * @param {string} props.value - Valor do campo
 * @param {Function} props.onChange - Função chamada quando o valor muda
 * @param {boolean} props.disabled - Se o campo está desabilitado
 * @param {boolean} props.autoFocus - Se o campo deve receber foco automaticamente
 */
const TextareaField = ({ 
  id, 
  value, 
  onChange, 
  disabled = false, 
  autoFocus = false 
}) => {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoFocus={autoFocus}
      className={styles.textarea}
    />
  );
};

export default TextareaField;