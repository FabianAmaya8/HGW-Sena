import { useState, useEffect, useCallback } from 'react';
import { urlDB } from '../../../urlDB';
import { useAuth } from '../../../pages/Context/AuthContext';

export default function usePersonal() {
    const {user} = useAuth();
    const userId = user.id;

    const [personal, setPersonal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPersonal = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const endpoint = `api/personal?id=${userId}`;
            const urlFetch = await urlDB(endpoint);
            const res = await fetch(urlFetch);
            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Error al obtener datos');
            setPersonal(data.usuario);
        } catch (err) {
            setError(err.message);
            setPersonal(null);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchPersonal();
    }, [fetchPersonal]);

    return { personal, loading, error, refetch: fetchPersonal };
}
