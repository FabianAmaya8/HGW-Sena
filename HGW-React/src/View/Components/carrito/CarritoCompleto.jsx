import { useContext } from "react";
import { CartContext } from "../../../pages/Context/CartContext";
import { useState } from "react";
import "../../../assets/css/CarritoCompleto.css";

export default function Carrito({ onNext }) {
    const { carrito, quitarDelCarrito, aumentarCantidad, disminuirCantidad } = useContext(CartContext);

    const totalCantidad = carrito.reduce((total, prod) => total + prod.cantidad, 0);
    const totalParcial = carrito.reduce((total, prod) => total + prod.precio * prod.cantidad, 0);
    const costoEnvio = 0;
    const valorImpuestos = 0;
    const totalFinal = totalParcial + costoEnvio + valorImpuestos;

    return (
        <div className="contenedor-general">
            <h2 className="titulo-principal">Resumen de Compra</h2>

            <div className="seccion-carrito">
                {/* Carrito de productos */}
                <div className="area-productos">
                    {carrito.length === 0 ? (
                        <p className="mensaje-vacio">Tu carrito está vacío.</p>
                    ) : (
                        <table className="tabla-productos">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carrito.map((prod) => (
                                    <tr key={prod.id_producto}>
                                        <td>{prod.nombre}</td>
                                        <td>
                                            <div className="cantidad-controles">
                                                <button className="btn-menos" onClick={() => disminuirCantidad(prod.id_producto)}>−</button>
                                                <span className="cantidad-numero">{prod.cantidad}</span>
                                                <button className="btn-mas" onClick={() => aumentarCantidad(prod.id_producto)}>+</button>
                                            </div>
                                        </td>
                                        <td>${prod.precio.toFixed(2)}</td>
                                        <td>
                                            <button className="boton-quitar" onClick={() => quitarDelCarrito(prod.id_producto)}>Quitar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Resumen del pedido */}
                <div className="area-resumen">
                    <h3 className="titulo-resumen">Detalle del Pedido</h3>
                    <p>Productos: {totalCantidad}</p>
                    <p>Subtotal: ${totalParcial.toFixed(2)}</p>
                    <p>Envío: ${costoEnvio.toFixed(2)}</p>
                    <p>Impuestos: ${valorImpuestos.toFixed(2)}</p>
                    <hr />
                    <p className="total-compra">Total: ${totalFinal.toFixed(2)}</p>
                    <button
                        className="boton-comprar"
                        onClick={() => {
                            if (typeof onNext === "function") {
                                onNext();
                            } else {
                                console.warn("onNext no está definido");
                            }
                        }}
                    >
                        Continuar con Envío
                    </button>
                </div>
            </div>
        </div>
    );
}
