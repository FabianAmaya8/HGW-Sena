// src/View/Components/carrito/PasoPago.jsx
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../../pages/Context/CartContext";
import "../../../assets/css/PasoPago.css";

export default function PasoPago({ onBack, onSuccess }) {
    const base = import.meta.env.VITE_API_URL;
    const { carrito, clearCart } = useContext(CartContext);

    const [medios, setMedios] = useState([]);
    const [medioPago, setMedioPago] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // 1. Recupero la dirección seleccionada (ya trae id_direccion > 0)
    const dirSel = JSON.parse(localStorage.getItem("direccionSeleccionada"));

    // Cálculo de totales…
    const totalCantidad = carrito.reduce((s, p) => s + p.cantidad, 0);
    const subtotal = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);
    const envio = 5000;
    const impuestos = Math.round(subtotal * 0.19);
    const totalFinal = subtotal + envio + impuestos;

    // Cargo métodos de pago
    useEffect(() => {
        fetch(`${base}/api/medios-pago`)
            .then(r => r.json())
            .then(setMedios)
            .catch(console.error);
    }, [base]);

    // 2. Al confirmar, armo el payload usando dirSel.id_direccion
    const confirmarPago = async () => {
        if (!dirSel) return setError("Selecciona una dirección");
        if (!medioPago) return setError("Selecciona un método de pago");
        if (carrito.length === 0) return setError("Tu carrito está vacío");

        setError("");
        setLoading(true);

        const payload = {
            id_usuario: Number(dirSel.id_usuario),
            id_direccion: Number(dirSel.id_direccion), // ← aquí
            id_medio_pago: parseInt(medioPago, 10),
            total: totalFinal,
            items: carrito.map(p => ({
                id_producto: p.id,
                cantidad: p.cantidad,
                precio_unitario: p.precio
            }))
        };

        try {
            const res = await fetch(`${base}/api/ordenes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al procesar orden");

            clearCart();
            onSuccess(data.id_orden);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contenedor-pago">
            <h2 className="titulo-principal">Confirmar Pago</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="seccion-carrito">
                {/* Métodos de pago */}
                <div className="area-productos">
                    <h3>Métodos de Pago</h3>
                    <div className="metodos-pago">
                        {medios.map(m => (
                            <label key={m.id_medio} className="opcion-medio">
                                <input
                                    type="radio"
                                    name="metodoPago"
                                    value={m.id_medio}
                                    checked={medioPago === String(m.id_medio)}
                                    onChange={e => setMedioPago(e.target.value)}
                                    disabled={loading}
                                />
                                {m.nombre_medio}
                            </label>
                        ))}
                    </div>

                    {/* Tarjeta de dirección con id_direccion correcto */}
                    <h3 className="mt-3">Dirección de Envío</h3>
                    {dirSel ? (
                        <div className="card-direccion">
                            <p><strong>Entrega en:</strong> {dirSel.lugar_entrega}</p>
                            <p><strong>Dirección:</strong> {dirSel.direccion}</p>
                            <p><strong>C.P.:</strong> {dirSel.codigo_postal}</p>
                            <p><strong>ID Ubicación:</strong> {dirSel.id_ubicacion}</p>
                        </div>
                    ) : (
                        <p>No hay dirección seleccionada.</p>
                    )}

                    {/* Lista de productos */}
                    <h3 className="mt-3">Productos</h3>
                    <div className="lista-productos">
                        {carrito.map(p => (
                            <div key={p.id} className="producto-item">
                                <span>{p.nombre}</span>
                                <span>{p.cantidad}×</span>
                                <span>${(p.precio * p.cantidad).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resumen y botón de pagar */}
                <div className="area-resumen">
                    <h3 className="titulo-resumen">Detalle del Pedido</h3>
                    <p>Productos: {totalCantidad}</p>
                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                    <p>Envío: ${envio.toFixed(2)}</p>
                    <p>Impuestos: ${impuestos.toFixed(2)}</p>
                    <hr />
                    <p className="total-compra">Total: ${totalFinal.toFixed(2)}</p>

                    <button
                        className="boton-comprar"
                        onClick={confirmarPago}
                        disabled={loading || !medioPago || !dirSel}
                    >
                        {loading ? "Procesando..." : "Pagar"}
                    </button>
                    <button
                        className="btn btn-outline-secondary mt-2"
                        onClick={onBack}
                        disabled={loading}
                    >
                        ← Atrás
                    </button>
                </div>
            </div>
        </div>
    );
}
