import { useProductsContext } from "../../pages/Context/ProductsContext.jsx";

export function useProducts() {
    const { products, loading } = useProductsContext();
    return { products, loading };
}
