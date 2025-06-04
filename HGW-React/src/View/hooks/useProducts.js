import { useState, useEffect } from 'react';
import { urlDB } from '../../urlDB';

export function useProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const endpoint = 'api/productos';
            const urlFetch = await urlDB(endpoint);

            const res = await fetch(urlFetch);
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            setProducts([]);
        }
        };

        fetchProducts();
    }, []);

    return products;
}
