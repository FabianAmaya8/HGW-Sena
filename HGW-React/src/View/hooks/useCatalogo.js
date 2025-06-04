import { useState, useEffect } from 'react';
import { urlDB } from '../../urlDB';


const useCatalogo = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCatalogo = async () => {
        try {
            const endpoint = 'api/catalogo';
            const urlFetch = await urlDB(endpoint);
            const res = await fetch(urlFetch);
            if (!res.ok) {
            throw new Error(`Error cargando catálogo: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();

            const categoriesMap = {};
            const subcategoriesList = [];

            data.forEach((item) => {
            const catId = item.id_categoria;
            const catName = item.nombre_categoria;
            const subId = item.id_subcategoria;
            const subName = item.nombre_subcategoria;

            if (!categoriesMap[catId]) {
                categoriesMap[catId] = { id: catId, nombre: catName };
            }

            subcategoriesList.push({
                id: subId,
                nombre: subName,
                categoryId: catId,
            });
            });

            const categoriesList = Object.values(categoriesMap);

            setCategories(categoriesList);
            setSubcategories(subcategoriesList);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchCatalogo();
    }, []);

    return { categories, subcategories, loading, error };
};

export default useCatalogo;
