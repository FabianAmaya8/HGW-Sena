const PRIMERA_URL = import.meta.env.VITE_URL_BACKEND;

// Función interna que prueba cuál base URL está viva
export function findWorkingBaseUrl() {
  const base = PRIMERA_URL;
  
  return base;
}

// Arrancamos la detección apenas se importe este módulo
const baseUrlPromise = findWorkingBaseUrl();

/**
 * Devuelve la URL completa para el endpoint dado,
 * utilizando la base que primero responda.
 * @param {string} endpoint — p.ej. 'api/ubicacion/paises'
 * @returns {Promise<string>}
 */
export async function urlDB(endpoint) {
  const base = await baseUrlPromise;
  // Asegúrate de que no dobles "/" si endpoint ya lo incluye
  const slash = endpoint.startsWith('/') ? '' : '/';
  return `${base.replace(/\/$/, '')}${slash}${endpoint}`;
}