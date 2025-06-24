import { useProducts } from '../hooks/useProducts';
import { alertaView } from '../hooks/alerta-añadir';
import { isLoggedIn } from '../../auth';

function formatPrice(price) {
    return `$${price.toLocaleString()}`;
}

function ProductCard({ product }) {
    const {
        nombre,
        precio,
        imagen,
        categoria,
        subcategoria,
        stock,
        id_producto
    } = product;

    const usuarioLogueado = isLoggedIn();
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const yaEstaEnCarrito = carrito.some(item => item.id_producto === id_producto);

    const imagenProductoUrl = `static/${imagen}`;

    const handleAgregar = () => {
        alertaView();
        const nuevoCarrito = [...carrito, product];
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    };

    // Clases y textos de stock
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

    return (
        <article className="cart-producto">
            <span className={stockIndicatorClass}></span>
            <span className={stockLabelClass}>{stockLabelText}</span>

            <a
                href="/usuario/catalogo/paginaproducto.html"
                aria-label={`Ver más sobre ${nombre}`}
            >
                <figure className="baner-productos">
                    <img src={imagenProductoUrl} alt={`Imagen del producto ${nombre}`} />
                </figure>

                <section className="info-producto">
                    <p className="categoria">{categoria}</p>
                    <p className="subcategoria">{subcategoria}</p>
                    <h3 className="nombre">{nombre}</h3>
                    <p className="precio">{formatPrice(precio)}</p>
                </section>
            </a>

            {/* Botón según login y carrito */}
            {usuarioLogueado ? (
                yaEstaEnCarrito ? (
                    <button className="btn-carrito btn-deshabilitado" disabled>
                        Ya está en el carrito
                    </button>
                ) : (
                    <button
                        className={`btn-carrito ${stock <= 0 ? 'btn-deshabilitado' : ''}`}
                        aria-label={`Agregar ${nombre} al carrito`}
                        disabled={stock <= 0}
                        onClick={handleAgregar}
                    >
                        Agregar al carrito
                    </button>
                )
            ) : (
                <p className="mensaje-login">Inicia sesión para agregar productos</p>
            )}
        </article>
    );
}

/**
 * ProductsList: renderiza lista de productos por categoría y subcategoría.
 */
export function ProductsList({ categoriaNombre, subcategoriaNombre }) {
    const productos = useProducts();

    console.log("Productos antes del filtrado:", productos);
    console.log(`Filtrando por categoría "${categoriaNombre}" y subcategoría "${subcategoriaNombre}"`);

    const productosFiltrados = productos.filter(
        prod =>
            prod.categoria?.trim().toLowerCase() === categoriaNombre?.trim().toLowerCase() &&
            prod.subcategoria?.trim().toLowerCase() === subcategoriaNombre?.trim().toLowerCase()
    );

    console.log("Productos después del filtrado:", productosFiltrados);

    return (
        <div className="carts">
            {productosFiltrados.length > 0 ? (
                productosFiltrados.map((p) => (
                    <ProductCard key={p.id_producto} product={p} />
                ))
            ) : (
                <p>No hay productos en esta subcategoría.</p>
            )}
        </div>
    );
}