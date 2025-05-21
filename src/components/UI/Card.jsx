import React from 'react';
import styles from '../../styles/layout.module.scss';

/**
 * Componente de card reutilizável
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo do card
 * @param {string} props.className - Classes adicionais
 */
const Card = ({ children, className = '', ...rest }) => {
  return (
    <div className={`${styles.card} ${className}`} {...rest}>
      {children}
    </div>
  );
};

/**
 * Cabeçalho do card
 */
Card.Header = ({ children, className = '', ...rest }) => {
  return (
    <div className={`${styles.cardHeader} ${className}`} {...rest}>
      {children}
    </div>
  );
};

/**
 * Título do card
 */
Card.Title = ({ children, className = '', ...rest }) => {
  return (
    <h2 className={`${styles.cardTitle} ${className}`} {...rest}>
      {children}
    </h2>
  );
};

/**
 * Seção de conteúdo do card
 */
Card.Content = ({ children, className = '', ...rest }) => {
  return (
    <div className={`${styles.contentSection} ${className}`} {...rest}>
      {children}
    </div>
  );
};

/**
 * Cabeçalho de seção dentro do card
 */
Card.SectionHeader = ({ children, className = '', ...rest }) => {
  return (
    <h3 className={`${styles.sectionHeader} ${className}`} {...rest}>
      {children}
    </h3>
  );
};

export default Card;