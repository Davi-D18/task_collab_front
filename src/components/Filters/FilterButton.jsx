import styles from "./FilterButton.module.scss";

/**
 * Botão de filtro reutilizável
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} props.label - Texto do botão
 * @param {boolean} props.active - Se o filtro está ativo
 * @param {Function} props.onClick - Função chamada ao clicar no botão
 */
const FilterButton = ({ label, active, onClick }) => {
  return (
    <button
      className={`${styles.filterButton} ${active ? styles.active : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default FilterButton;
