import { useEffect, useState } from 'react';
import { urlDB } from '../../urlDB';

export function useBuscarProductos(q) {
    const [loading, setLoading] = useState(true);
    const [productosFiltrados, setProductosFiltrados] = useState([]);

    useEffect(() => {
        if (!q) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(await urlDB('api/productos'));
                const data = await res.json();

                const qLower = q.toLowerCase();
                const filtrados = data.filter((p) =>
                    p.nombre.toLowerCase().includes(qLower) ||
                    (p.categoria?.toLowerCase() || '').includes(qLower) ||
                    (p.subcategoria?.toLowerCase() || '').includes(qLower)
                );

                setProductosFiltrados(filtrados);
            } catch (error) {
                console.error('Error al buscar productos:', error);
                setProductosFiltrados([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [q]);

    return { loading, productosFiltrados };
}
