import { Link } from "react-router-dom";
import "../../../assets/css/CarritoCompleto.css";
import { useImageUrl } from "../../../User/Hooks/useImgUrl";
import Resumen from "./Resumen";

export default function Carrito({ carrito, aumentarCantidad, disminuirCantidad, quitarDelCarrito, onNext }) {
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
                                        key={prod.id_producto}
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

                <Resumen
                    carrito={carrito}
                    taxRate={0} // Ajusta según sea necesario
                    loading={false} // Cambia según tu lógica de carga
                    medioPago={null} // Ajusta según tu lógica de pago
                    dirSel={null} // Ajusta según tu lógica de dirección
                    step="cart"
                    onNext={onNext}
                />
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
