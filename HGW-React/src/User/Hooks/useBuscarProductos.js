import { useEffect, useState } from "react";
import { useProductsContext } from "../../pages/Context/ProductsContext.jsx";

export function useBuscarProductos(q) {
    const { products } = useProductsContext();
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!q || !products) return;

        setLoading(true);
        
        const qLower = q.toLowerCase();

        const filtrados = products.filter((p) =>
            p.nombre.toLowerCase().includes(qLower) ||
            (p.categoria?.toLowerCase() || "").includes(qLower) ||
            (p.subcategoria?.toLowerCase() || "").includes(qLower)
        );

        setProductosFiltrados(filtrados);
        setLoading(false);

    }, [q, products]);

    return { loading, productosFiltrados };
}
