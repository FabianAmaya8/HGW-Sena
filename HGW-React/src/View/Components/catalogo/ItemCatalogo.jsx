import { ProductsList } from "../productos";

const ItemCatalogo = ({ category, subcategories }) => {
    const nombreCategoria = category.nombre.replace(/\s+/g, '');

    return (
        <div id={nombreCategoria} className="conten-item">
            <div className="item-categorias">
                <h2>{category.nombre}</h2>

                {subcategories.map((sub) => (
                    <div key={sub.id} className="item-subcategoria">
                        <h3>{sub.nombre}</h3>
                        <div className="productos-container">
                            {/* 🔥 Aquí pasamos los nombres en lugar de los IDs */}
                            <ProductsList categoriaNombre={category.nombre} subcategoriaNombre={sub.nombre} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemCatalogo;


