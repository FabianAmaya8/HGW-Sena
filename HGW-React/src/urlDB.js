const PRIMERA_URL = "http://localhost:3000/";
const SEGUNDA_URL = "https://hgw-sena-production.up.railway.app/";

// Función interna que prueba cuál base URL está viva
export async function findWorkingBaseUrl() {
  const bases = [PRIMERA_URL, SEGUNDA_URL];
  for (const base of bases) {
    // try {
    //   const res = await fetch(`${base}`, { method: 'HEAD' });
    //   if (res.ok) return base;
    // } catch (_) {
    //   console.warn(`Base caída: ${base}`);
    // }
  }
  // console.error("Ninguna base URL responde");
  return PRIMERA_URL;
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
