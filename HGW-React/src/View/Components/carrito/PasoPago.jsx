import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../../pages/Context/CartContext";
import "../../../assets/css/PasoPago.css";

export default function PasoPago({ onBack }) {
    const { carrito } = useContext(CartContext);
    const [direccion, setDireccion] = useState(null);

    const totalCantidad = carrito.reduce((total, prod) => total + prod.cantidad, 0);
    const totalParcial = carrito.reduce((total, prod) => total + prod.precio * prod.cantidad, 0);
    const costoEnvio = 0;
    const valorImpuestos = 0;
    const totalFinal = totalParcial + costoEnvio + valorImpuestos;

    useEffect(() => {
        const rawDireccion = localStorage.getItem("direccionSeleccionada");
        if (rawDireccion) {
            setDireccion(JSON.parse(rawDireccion));
        }
    }, []);


    const confirmarPedido = () => {
        console.log("Pedido confirmado");
        console.log("Productos:", carrito);
        console.log("Enviado a:", direccion);
        alert("✅ Pedido confirmado con éxito");
        // Aquí podés conectar con tu backend si querés registrar el pedido
    };

    return (
        <div className="paso-pago">
            <h2>Resumen Final del Pedido</h2>

            <div className="info-envio">
                <h4>Dirección de Envío</h4>
                {direccion ? (
                    <ul>
                        <li><strong>Entrega en:</strong> {direccion.lugar_entrega}</li>
                        <li><strong>Dirección:</strong> {direccion.direccion}</li>
                        <li><strong>Código postal:</strong> {direccion.codigo_postal}</li>
                        <li><strong>Ubicación:</strong> {direccion.id_ubicacion}</li>
                    </ul>
                ) : (
                    <p>No hay dirección seleccionada.</p>
                )}
            </div>

            <div className="resumen-productos">
                <h4>Productos del Carrito</h4>
                <table className="tabla-resumen">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carrito.map((prod) => (
                            <tr key={prod.id_producto}>
                                <td>{prod.nombre}</td>
                                <td>{prod.cantidad}</td>
                                <td>${prod.precio.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="resumen-total">
                <p>Subtotal: ${totalParcial.toFixed(2)}</p>
                <p>Envío: ${costoEnvio.toFixed(2)}</p>
                <p>Impuestos: ${valorImpuestos.toFixed(2)}</p>
                <hr />
                <p className="total-compra">Total a pagar: ${totalFinal.toFixed(2)}</p>
            </div>

            <div className="botones-finales">
                <button className="btn btn-outline-secondary" onClick={onBack}>
                    ← Volver a Envío
                </button>
                <button className="btn btn-success" onClick={confirmarPedido}>
                    Confirmar Pedido
                </button>
            </div>
        </div>
    );
}
