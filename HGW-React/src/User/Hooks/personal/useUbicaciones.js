import { useState, useEffect, useCallback } from 'react';
import { urlDB } from '../../../urlDB';

export default function useUbicaciones() {
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar países al montar
  useEffect(() => {
    const fetchPaises = async () => {
      setLoading(true);
      try {
        const url = await urlDB('api/ubicacion/paises');
        const res = await fetch(url);
        setPaises(await res.json());
      } catch (err) {
        setError('Error al cargar países');
      } finally {
        setLoading(false);
      }
    };
    fetchPaises();
  }, []);

  // Cargar ciudades según país seleccionado
  const fetchCiudades = useCallback(async (paisId) => {
    setLoading(true);
    try {
      const url = await urlDB(`api/ubicacion/ciudades?paisId=${paisId}`);
      const res = await fetch(url);
      setCiudades(await res.json());
    } catch (err) {
      setError('Error al cargar ciudades');
    } finally {
      setLoading(false);
    }
  }, []);

  return { paises, ciudades, fetchCiudades, loading, error };
}
