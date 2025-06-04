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
                            <ProductsList />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemCatalogo;
