import { createContext, useContext, useEffect, useState } from "react";
import { urlDB } from "../../urlDB";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [catalogo, setCatalogo] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // ----- Productos -----
                const urlProductos = await urlDB("api/productos");
                const resProd = await fetch(urlProductos);
                const dataProd = await resProd.json();
                const productosOrdenados = dataProd.sort((a, b) => a.id_producto - b.id_producto);

                // ----- Catálogo -----
                const urlCatalogo = await urlDB("api/catalogo");
                const resCat = await fetch(urlCatalogo);
                const dataCat = await resCat.json();

                setProducts(productosOrdenados);
                setCatalogo(dataCat);
            } catch (err) {
                console.error("Error cargando contexto global:", err);
                setProducts([]);
                setCatalogo([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <ProductsContext.Provider value={{ products, catalogo, loading }}>
            {children}
        </ProductsContext.Provider>
    );
};

export const useProductsContext = () => useContext(ProductsContext);
