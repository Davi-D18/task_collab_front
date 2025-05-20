/**
 * Remove espaços duplos, tabs e qualquer tipo de espaço, substituindo por um único underscore
 * @param {string} texto - O texto a ser processado
 * @returns {string} - O texto com espaços substituídos por underscores
 */
export const substituirEspacosPorUnderline = (texto) => {
  return texto.replace(/\s+/g, '_').trim();
};