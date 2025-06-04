import { useProducts } from '../hooks/useProducts';
import { alertaView } from '../hooks/alerta-añadir';

function formatPrice(price) {
    return `$${price.toLocaleString()}`;
    }

    /**
     * ProductCard: componente que recibe un producto y lo renderiza como tarjeta.
     * Props:
     *   - product: {
     *       id_producto,
     *       nombre,
     *       precio,
     *       imagen,
     *       categoria,
     *       subcategoria,
     *       stock
     *     }
     */
function ProductCard({ product }) {
    const {
        nombre,
        precio,
        imagen,
        categoria,
        subcategoria,
        stock,
    } = product;

  // Determina clases y texto para indicador de stock
    let stockIndicatorClass = '';
    let stockLabelText = '';
    let stockLabelClass = '';

    if (stock > 10) {
        stockIndicatorClass = 'stock-indicator in-stock';
        stockLabelText = 'Stock disponible';
        stockLabelClass = 'stock-label in-stock';
    } else if (stock > 0) {
        stockIndicatorClass = 'stock-indicator low-stock';
        stockLabelText = `¡Solo ${stock} unidades!`;
        stockLabelClass = 'stock-label low-stock';
    } else {
        stockIndicatorClass = 'stock-indicator out-of-stock';
        stockLabelText = 'Agotado';
        stockLabelClass = 'stock-label out-of-stock';
    }

    const imagenProductoUrl = `static/${imagen}`;

    return (
        <article className="cart-producto">
            {/* Indicador visual (punto de color) */}
            <span className={stockIndicatorClass}></span>

            {/* Texto que muestra estado de stock */}
            <span className={stockLabelClass}>{stockLabelText}</span>

            {/* Enlace a detalle de producto */}
            <a
                href="/usuario/catalogo/paginaproducto.html"
                aria-label={`Ver más sobre ${nombre}`}
            >
                <figure className="baner-productos">
                <img
                    src={imagenProductoUrl}
                    alt={`Imagen del producto ${nombre}`}
                />
                </figure>

                <section className="info-producto">
                <p className="categoria">{categoria}</p>
                <p className="subcategoria">{subcategoria}</p>
                <h3 className="nombre">{nombre}</h3>
                <p className="precio">{formatPrice(precio)}</p>
                </section>
            </a>

        {/* Botón "Agregar al carrito" */}
            <button
                className={`btn-carrito ${stock <= 0 ? 'btn-deshabilitado' : ''}`}
                aria-label={`Agregar ${nombre} al carrito`}
                disabled={stock <= 0}
                onClick={() => {
                alertaView();
                }}
            >
                Agregar al carrito
            </button>
        </article>
    );
}

/**
 * ProductsList: componente principal que renderiza toda la lista de productos sin límite.
 *
 * Ejemplo de uso en JSX:
 *   <ProductsList />
 */
export function ProductsList() {
    const productos = useProducts();

    return (
        <div className="carts">
            {productos.map((p) => (
                <ProductCard key={p.id_producto} product={p} />
            ))}
        </div>
    );
}