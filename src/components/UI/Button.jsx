import React from 'react';
import styles from '../../styles/buttons.module.scss';

/**
 * Componente de botão reutilizável
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.variant - Variante do botão (back, delete, edit, save, create)
 * @param {Function} props.onClick - Função chamada ao clicar no botão
 * @param {boolean} props.disabled - Se o botão está desabilitado
 * @param {React.ReactNode} props.children - Conteúdo do botão
 * @param {string} props.type - Tipo do botão (button, submit, reset)
 */
const Button = ({ 
  variant = 'edit', 
  onClick, 
  disabled = false, 
  children, 
  type = 'button',
  ...rest 
}) => {
  const getButtonClass = () => {
    switch (variant) {
      case 'back':
        return styles.backButton;
      case 'delete':
        return styles.deleteButton;
      case 'save':
        return styles.saveButton;
      case 'create':
        return styles.createButton;
      case 'edit':
      default:
        return styles.editButton;
    }
  };

  return (
    <button
      type={type}
      className={getButtonClass()}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;