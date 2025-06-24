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

                if (!res.ok) {
                    throw new Error(`Error en la petición: ${res.status} ${res.statusText}`);
                }

                const data = await res.json();

                console.log("Total de productos recibidos desde la API:", data.length);
                console.log("Productos completos antes de guardarlos:", data);

                const productosOrdenados = data.sort((a, b) => a.id_producto - b.id_producto);

                setProducts(productosOrdenados);
            } catch (error) {
                console.error("Error al obtener productos:", error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);

    return products;
}
