import { useImageUrl } from '../../User/Hooks/useImgUrl';
import { alertaView, mostrarAlerta } from '../hooks/alerta-añadir';
import { useCart } from '../../pages/Context/CartContext';
import { handleAgregarProducto } from '../hooks/carritoUtils';
import { Link } from "react-router-dom";
function formatPrice(price) {
    return `$${price.toLocaleString()}`;
}

export function ProductCard({ product }) {
    
    const {
        nombre,
        precio,
        imagen,
        categoria,
        subcategoria,
        stock,
    } = product;

    const { agregarProducto } = useCart();

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
    
    const imagenProductoUrl = useImageUrl(imagen);

    return (
        <article className="cart-producto">
            {/* Indicador visual (punto de color) */}
            <span className={stockIndicatorClass}></span>

            {/* Texto que muestra estado de stock */}
            <span className={stockLabelClass}>{stockLabelText}</span>

            {/* Enlace a detalle de producto */}

            <Link to={`/producto/${product.id_producto}`} aria-label={`Ver más sobre ${nombre}`}>
                <figure className="baner-productos">
                    <img src={imagenProductoUrl} alt={`Imagen del producto ${nombre}`} />
                </figure>

                <section className="info-producto">
                    <p className="categoria">{categoria}</p>
                    <p className="subcategoria">{subcategoria}</p>
                    <h3 className="nombre">{nombre}</h3>
                    <p className="precio">{formatPrice(precio)}</p>
                </section>
            </Link>

        {/* Botón "Agregar al carrito" */}
            <button
                className="boton-carrito"
                onClick={async () => {
                    const resultado = await handleAgregarProducto({
                        producto: {
                            id_producto: product.id_producto,
                            nombre: product.nombre,
                            precio: product.precio
                        },
                        cantidad: 1
                    });

                    if (resultado.exito) {
                        agregarProducto(product, 1); // 👈 actualiza el estado local del carrito
                        mostrarAlerta(product.nombre, () => {
                            setTimeout(() => {
                                window.location.href = "/carrito";
                            }, 100);
                        });
                    } else {
                        alertaView(); // el usuario no está logueado
                    }
                }}
            >
                <i className="bx bx-cart-add"></i>
            </button>


        </article>
    );
}

export function ProductsList({categoriaNombre, subcategoriaNombre, productos}) {

    const productosFiltrados = productos.filter(
        prod => 
            prod.categoria?.trim().toLowerCase() === categoriaNombre?.trim().toLowerCase() &&
            prod.subcategoria?.trim().toLowerCase() === subcategoriaNombre?.trim().toLowerCase()
    );

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

export function ProductosLimitados({ limit, start=0 , productos }) {
    const limitados = productos.slice(start,start + limit);

    return (
        <div className="carts">
            {limitados.map((p) => (
                <ProductCard key={p.id_producto} product={p} />
            ))}
        </div>
    );
}
