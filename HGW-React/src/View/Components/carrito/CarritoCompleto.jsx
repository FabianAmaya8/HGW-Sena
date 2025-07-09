import { Link } from "react-router-dom";
import "../../../assets/css/CarritoCompleto.css";
import { useImageUrl } from "../../../User/Hooks/useImgUrl";

export default function Carrito({ carrito, aumentarCantidad, disminuirCantidad, quitarDelCarrito, onNext }) {
    const totalCantidad = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    const totalParcial = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    const costoEnvio = 0;
    const impuestos = 0;
    const totalFinal = totalParcial + costoEnvio + impuestos;

    console.log(carrito);

    return (
        <div className="contenedor-general">
            <h2 className="titulo-principal">Resumen de Compra</h2>

            <div className="seccion-carrito">
                <div className="area-productos">
                    {carrito.length === 0 ? (
                        <p className="mensaje-vacio">Tu carrito está vacío.</p>
                    ) : (
                        <table className="tabla-productos">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carrito.map(prod => (
                                    <CardProductoCarrito
                                        prod={prod}
                                        quitarDelCarrito={quitarDelCarrito}
                                        aumentarCantidad={aumentarCantidad}
                                        disminuirCantidad={disminuirCantidad}
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="area-resumen">
                    <h3 className="titulo-resumen">Detalle del Pedido</h3>
                    <p>Productos: {totalCantidad}</p>
                    <p>Subtotal: ${totalParcial.toFixed(2)}</p>
                    <p>Envío: ${costoEnvio.toFixed(2)}</p>
                    <p>Impuestos: ${impuestos.toFixed(2)}</p>
                    <hr />
                    <p className="total-compra">Total: ${totalFinal.toFixed(2)}</p>
                    <button className="boton-comprar" onClick={onNext}>
                        Continuar con Envío
                    </button>
                </div>
            </div>
        </div>
    );
}

function CardProductoCarrito({ prod, quitarDelCarrito, aumentarCantidad, disminuirCantidad }) {
    const imgUrl = useImageUrl(prod.imagen);
    return (
        <tr>
            <td>
                <Link to={`/producto/${prod.id_producto}`} className="imgProducto">
                    <img src={imgUrl} alt={prod.nombre}/>
                </Link>
            </td>
            <td>
                <Link to={`/producto/${prod.id_producto}`} style={{ textDecoration: "none", color: "inherit" }}>
                    {prod.nombre}
                </Link>
            </td>
            <td>
                <div className="cantidad-controles">
                    <button className="btn-menos" onClick={() => disminuirCantidad(prod.id_producto)}>−</button>
                    <span className="cantidad-numero">{prod.cantidad}</span>
                    <button className="btn-mas" onClick={() => aumentarCantidad(prod.id_producto)}>+</button>
                </div>
            </td>
            <td>${prod.precio.toFixed(2)}</td>
            <td>
                <button className="boton-quitar" onClick={() => quitarDelCarrito(prod.id_producto)}>
                    Quitar
                </button>
            </td>
        </tr>
    );
}
