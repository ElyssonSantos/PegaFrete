/**
 * Utilitários de Segurança para PegaFrete Mercado
 */

/**
 * Sanitiza strings para evitar XSS e caracteres maliciosos
 * @param {string} str 
 * @returns {string}
 */
export const sanitize = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/[<>]/g, '') // Remove < e >
    .trim();
};

/**
 * Filtra objetos de formulário aplicando sanitização em todos os campos string
 * @param {Object} data 
 * @returns {Object}
 */
export const sanitizeForm = (data) => {
  const sanitized = { ...data };
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitize(sanitized[key]);
    }
  });
  return sanitized;
};
