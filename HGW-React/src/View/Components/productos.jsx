import { Link } from 'react-router-dom';
import { useImageUrl } from '../../User/Hooks/useImgUrl';
import { alertaView, mostrarAlerta } from '../hooks/alerta-añadir';
import { isLoggedIn } from '../../auth';
import { useCarrito } from '../hooks/useCarrito';

function formatPrice(price) {
  return `$${price.toLocaleString()}`;
}

export function ProductCard({ product }) {
    const { agregarProductoAlCarrito } = useCarrito();
    const {
        id_producto,
        nombre,
        precio,
        imagen,
        categoria,
        subcategoria,
        stock,
    } = product;

    // Indicador de stock
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
            <span className={stockIndicatorClass}></span>
            <span className={stockLabelClass}>{stockLabelText}</span>

            <Link
                to={`/producto/${id_producto}`}
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
            </Link>

            {isLoggedIn() ? (
                <button
                className="boton-carrito"
                onClick={async () => {
                    const resultado = await agregarProductoAlCarrito(product, 1);
                    if (resultado.exito) {
                    mostrarAlerta(product.nombre, () => {
                        setTimeout(() => {
                        window.location.href = '/carrito';
                        }, 100);
                    });
                    } else {
                    console.error('Fallo:', resultado.mensaje);
                    }
                }}
                >
                <i className="bx bx-cart-add"></i>
                </button>
            ) : (
                <button
                className="boton-carrito"
                aria-label={`Agregar ${nombre} al carrito`}
                onClick={alertaView}
                >
                <i className="bx bx-cart-add"></i>
                </button>
            )}
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
