/**
 * Mapeia valores de status para códigos usados pela API
 */
export const statusMap = {
  "Pendente": "P",
  "Em Andamento": "EA",
  "Concluída": "C"
};

/**
 * Mapeia valores de prioridade para códigos usados pela API
 */
export const prioridadeMap = {
  "Baixa": "B",
  "Media": "M",
  "Alta": "A"
};

/**
 * Mapeia códigos de status da API para valores de exibição
 */
export const statusDisplayMap = {
  "P": "Pendente",
  "EA": "Em Andamento",
  "C": "Concluída"
};

/**
 * Mapeia códigos de prioridade da API para valores de exibição
 */
export const prioridadeDisplayMap = {
  "B": "Baixa",
  "M": "Media",
  "A": "Alta"
};

/**
 * Retorna o estilo de cor para uma prioridade específica
 * @param {string} priority - A prioridade da tarefa
 * @returns {Object} - Objeto de estilo para a prioridade
 */
export const getPriorityColor = (priority) => {
  switch (priority) {
    case "Alta":
      return { 
        color: "#ef4444", 
        fontWeight: "bold", 
        borderBottom: "2px solid #ef4444" 
      };
    case "Media":
      return { 
        color: "#f59e0b", 
        fontWeight: "bold", 
        borderBottom: "2px solid #f59e0b" 
      };
    case "Baixa":
      return { 
        color: "#10b981", 
        fontWeight: "bold", 
        borderBottom: "2px solid #10b981" 
      };
    default:
      return { 
        color: "#6b7280", 
        fontWeight: "normal" 
      };
  }
};

/**
 * Retorna informações de estilo e ícone para um status específico
 * @param {string} status - O status da tarefa
 * @returns {Object} - Objeto com nome do ícone, label e estilo para o status
 */
export const getStatusInfo = (status) => {
  switch (status) {
    case "C":
    case "concluida":
    case "Concluída":
      return {
        iconType: "CheckCircle2",
        label: "Concluída",
        style: { 
          color: "#ffffff", 
          backgroundColor: "#10b981", 
          padding: "2px 8px", 
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontWeight: "bold",
          whiteSpace: "nowrap"
        }
      };
    case "EA":
    case "em_andamento":
    case "Em Andamento":
      return {
        iconType: "AlertCircle",
        label: "Em Andamento",
        style: { 
          color: "#ffffff", 
          backgroundColor: "#f59e0b", 
          padding: "2px 8px", 
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontWeight: "bold",
          whiteSpace: "nowrap"
        }
      };
    default:
      return {
        iconType: "Clock",
        label: "Pendente",
        style: { 
          color: "#ffffff", 
          backgroundColor: "#6b7280", 
          padding: "2px 8px", 
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontWeight: "bold",
          whiteSpace: "nowrap"
        }
      };
  }
};