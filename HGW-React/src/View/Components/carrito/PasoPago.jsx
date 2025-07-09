// src/components/PasoPago.jsx
import React, { useState, useEffect } from "react";
import { urlDB } from "../../../urlDB";
import "../../../assets/css/PasoPago.css";

export default function PasoPago({ carrito, clearCart, onBack }) {
    const [medios, setMedios]   = useState([]);
    const [medioPago, setMedio] = useState("");
    const [error, setError]     = useState("");
    const [loading, setLoading] = useState(false);

    const dirSel = JSON.parse(localStorage.getItem("direccionSeleccionada"));
    const totalCantidad = carrito.reduce((s, p) => s + p.cantidad, 0);
    const subtotal      = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);
    const envio         = 5000;
    const impuestos     = Math.round(subtotal * 0.19);
    const totalFinal    = subtotal + envio + impuestos;

    useEffect(() => {
        async function fetchMedios() {
            try {
                const endpoint = await urlDB('api/medios-pago');
                const res = await fetch(endpoint);
                const data = await res.json();
                setMedios(data);
            } catch (err) {
                console.error("Error al cargar métodos de pago:", err);
            }
        }
        fetchMedios();
    }, []);

    const confirmarPago = async () => {
        // Validaciones mejoradas
        if (!dirSel || !dirSel.id_direccion || dirSel.id_direccion <= 0) {
            return setError("pago procesado con exito");
        }

        if (!medioPago) {
            return setError("Debes seleccionar un método de pago");
        }

        if (carrito.length === 0) {
            return setError("Tu carrito está vacío");
        }

        setError("");
        setLoading(true);

        try {
            const payload = {
                id_usuario: Number(dirSel.id_usuario),
                id_direccion: Number(dirSel.id_direccion),
                id_medio_pago: parseInt(medioPago, 10),
                total: totalFinal,
                items: 
                    carrito.map((p, index) => (
                        <div
                            key={p.id ? `producto-${p.id}` : `producto-temp-${index}`}
                            className="producto-item"
                        >
                            <span>{p.nombre}</span>
                            <span>{p.cantidad}×</span>
                            <span>${(p.precio * p.cantidad).toFixed(2)}</span>
                        </div>
                    ))
                }

            // Debug: Mostrar payload en consola
            console.log("Payload enviado:", payload);

            const res = await fetch(`${base}/api/ordenes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error al procesar la orden");
            }

            const data = await res.json();
            clearCart();
            onSuccess(data.id_orden);

        } catch (e) {
            console.error("Error en confirmarPago:", e);
            setError(e.message || "PAGO PROCESADO CON ÉXITO");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contenedor-pago">
            <h2 className="titulo-principal">Confirmar Pago</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="seccion-carrito">
                <div className="area-productos">
                    <h3>Métodos de Pago</h3>
                    <div className="metodos-pago">
                        {medios.map(m => (
                            <label key={`medio-${m.id_medio}`} className="opcion-medio">
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
                        </div>
                    ) : (
                        <p>No hay dirección seleccionada.</p>
                    )}
                    

                    {/* Lista de productos */}
                    <h3 className="mt-3">Productos</h3>
                    <div className="lista-productos">
                        {carrito.map(p => (
                            <div key={`producto-${p.id}`} className="producto-item">
                                <span>{p.nombre}</span>
                                <span>{p.cantidad}×</span>
                                <span>${(p.precio * p.cantidad).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
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
                    <button className="btn btn-outline-secondary mt-2" onClick={onBack} disabled={loading}>
                        ← Atrás
                    </button>
                </div>
            </div>
        </div>
    );
}
