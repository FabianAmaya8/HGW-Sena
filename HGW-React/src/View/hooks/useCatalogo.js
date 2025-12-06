import { useProductsContext } from "../../pages/Context/ProductsContext.jsx";

export default function useCatalogo() {
    const { catalogo, loading } = useProductsContext();

    if (!catalogo) return { categories: [], subcategories: [], loading };

    // reconstruimos lo que ya hacías
    const categoriesMap = {};
    const subcategoriesList = [];

    catalogo.forEach((item) => {
        const catId = item.id_categoria;
        const catName = item.nombre_categoria;
        const catImg = item.img_categoria || "";
        const subId = item.id_subcategoria;
        const subName = item.nombre_subcategoria;

        if (!categoriesMap[catId]) {
            categoriesMap[catId] = {
                id: catId,
                nombre: catName,
                img: catImg,
            };
        }

        subcategoriesList.push({
            id: subId,
            nombre: subName,
            categoryId: catId,
        });
    });

    const categories = Object.values(categoriesMap);

    return { categories, subcategories: subcategoriesList, loading };
}
