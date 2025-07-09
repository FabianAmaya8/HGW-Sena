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
        if (!dirSel) return setError("Selecciona una dirección");
        if (!medioPago) return setError("Selecciona un método de pago");
        if (carrito.length === 0) return setError("Tu carrito está vacío");
        setError(""); setLoading(true);

        const payload = {
            id_usuario: Number(dirSel.id_usuario),
            id_direccion: Number(dirSel.id_direccion),
            id_medio_pago: parseInt(medioPago, 10),
            total: totalFinal,
            items: carrito.map(p => ({
                id_producto: p.id_producto,
                cantidad: p.cantidad,
                precio_unitario: p.precio
            }))
        };

        try {
            const endpoint = await urlDB('api/ordenes');
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al procesar orden");
            clearCart();
            // Aquí podrías redirigir o mostrar éxito
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
                <div className="area-productos">
                    <h3>Métodos de Pago</h3>
                    {medios.map(m => (
                        <label key={m.id_medio} className="opcion-medio">
                            <input
                                type="radio"
                                name="metodoPago"
                                value={m.id_medio}
                                checked={medioPago === String(m.id_medio)}
                                onChange={e => setMedio(e.target.value)}
                                disabled={loading}
                            />
                            {m.nombre_medio}
                        </label>
                    ))}
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
                    <h3 className="mt-3">Productos</h3>
                    {carrito.map(p => (
                        <div key={p.id_producto} className="producto-item">
                            <span>{p.nombre}</span>
                            <span>{p.cantidad}×</span>
                            <span>${(p.precio * p.cantidad).toFixed(2)}</span>
                        </div>
                    ))}
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
