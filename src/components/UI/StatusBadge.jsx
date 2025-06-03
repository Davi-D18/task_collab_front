import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { getStatusInfo } from "../../utils/taskUtils";

/**
 * Componente para exibir o status de uma tarefa como um badge
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} props.status - Status da tarefa
 */
const StatusBadge = ({ status }) => {
  const statusInfo = getStatusInfo(status);

  // Renderiza o ícone apropriado com base no tipo
  const renderIcon = () => {
    switch (statusInfo.iconType) {
      case "CheckCircle2":
        return <CheckCircle2 size={16} color="#ffffff" />;
      case "AlertCircle":
        return <AlertCircle size={16} color="#ffffff" />;
      case "Clock":
      default:
        return <Clock size={16} color="#ffffff" />;
    }
  };

  return (
    <span style={statusInfo.style}>
      {renderIcon()}
      {statusInfo.label}
    </span>
  );
};

export default StatusBadge;
