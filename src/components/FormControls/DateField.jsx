import React from 'react';
import styles from '../../styles/forms.module.scss';

/**
 * Componente reutilizável para campos de data
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.id - ID do campo
 * @param {string} props.label - Rótulo do campo
 * @param {string} props.value - Valor da data
 * @param {Function} props.onChange - Função chamada quando o valor muda
 * @param {boolean} props.disabled - Se o campo está desabilitado
 * @param {React.ReactNode} props.icon - Ícone opcional para exibir antes do campo
 */
const DateField = ({ 
  id, 
  label, 
  value, 
  onChange, 
  disabled = false, 
  icon = null 
}) => {
  return (
    <div className={styles.formControl}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {icon}
        <input
          id={id}
          type="date"
          value={value || ""}
          onChange={onChange}
          className={styles.dateInput}
          required
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default DateField;