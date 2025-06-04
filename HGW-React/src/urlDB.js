const PRIMERA_URL = "http://localhost:3000/";
const SEGUNDA_URL = "https://18xxz2p0-3000.use2.devtunnels.ms/";

// Función interna que prueba cuál base URL está viva
async function findWorkingBaseUrl() {
  const bases = [PRIMERA_URL, SEGUNDA_URL];
  for (const base of bases) {
    try {
      // Puedes usar un endpoint liviano como /api/status o la raíz "/"
      const res = await fetch(`${base}api/status`, { method: 'HEAD' });
      if (res.ok) return base;
    } catch (_) {
      console.warn(`Base caída: ${base}`);
    }
  }
  console.error("Ninguna base URL responde");
  // opcional: lanzar error o devolver la primera para no romper tu app
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
