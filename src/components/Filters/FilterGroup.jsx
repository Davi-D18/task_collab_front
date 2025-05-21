import React from 'react';
import styles from './FilterGroup.module.scss';

/**
 * Componente para agrupar filtros
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.label - Rótulo do grupo de filtros
 * @param {React.ReactNode} props.icon - Ícone opcional
 * @param {React.ReactNode} props.children - Botões de filtro
 */
const FilterGroup = ({ label, icon, children }) => {
  return (
    <div className={styles.filterSection}>
      <div className={styles.filterLabel}>
        {icon}
        <span>{label}</span>
      </div>
      <div className={styles.filterButtons}>
        {children}
      </div>
    </div>
  );
};

export default FilterGroup;