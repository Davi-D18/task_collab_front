import React from 'react';
import styles from '../../styles/forms.module.scss';

/**
 * Componente reutilizável para campos de seleção
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.id - ID do campo
 * @param {string} props.label - Rótulo do campo
 * @param {string} props.value - Valor selecionado
 * @param {Function} props.onChange - Função chamada quando o valor muda
 * @param {Array} props.options - Opções disponíveis para seleção
 * @param {boolean} props.disabled - Se o campo está desabilitado
 * @param {Object} props.style - Estilos adicionais para o select
 * @param {React.ReactNode} props.icon - Ícone opcional para exibir antes do select
 */
const SelectField = ({ 
  id, 
  label, 
  value, 
  onChange, 
  options, 
  disabled = false, 
  style = {}, 
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
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={styles.select}
          style={style}
          disabled={disabled}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectField;