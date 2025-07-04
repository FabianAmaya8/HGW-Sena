import { useState, useEffect } from 'react';
import { findWorkingBaseUrl } from '../../../urlDB';

const useMembrecias = () => {
    const [membresias, setMembresias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMembrecias = async () => {
            try {
                const baseUrl = await findWorkingBaseUrl();
                const response = await fetch(`${baseUrl}api/membresias`);
                if (!response.ok) {
                    throw new Error('Error al obtener las membresías');
                }
                const data = await response.json();
                if (data.success) {
                    setMembresias(data.membresias);
                } else {
                    throw new Error('Error en la respuesta del servidor');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMembrecias();
    }, []);

    return { membresias, loading, error };
};

export default useMembrecias;
