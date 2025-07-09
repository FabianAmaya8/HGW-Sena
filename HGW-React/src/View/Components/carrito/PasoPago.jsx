import { useState, useEffect } from "react";
import { urlDB } from "../../../urlDB";
import "../../../assets/css/PasoPago.css";
import Resumen from "./Resumen";
import { useCarrito } from "../../hooks/useCarrito";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function PasoPago({ carrito, clearCart, onBack }) {
    const { direccion, obtenerDirecciones } = useCarrito();
    const [medios, setMedios] = useState([]);
    const [medioPago, setMedioPago] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const dirSel = direccion[0] || null;
    const subtotal = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    const envio = 5000;
    const impuestos = Math.round(subtotal * 0.19);
    const totalFinal = subtotal + envio + impuestos;

    useEffect(() => {
        async function fetchMedios() {
            try {
                const endpointMedios = await urlDB("api/medios-pago");
                const res = await fetch(endpointMedios);
                if (!res.ok) throw new Error();
                setMedios(await res.json());
            } catch {
                setError("No se pudieron cargar los métodos de pago");
            }
        }
        fetchMedios();
        obtenerDirecciones();
    }, []);

    const confirmarPago = async () => {
        if (!dirSel?.id_direccion) {
            setError("Debes seleccionar una dirección de envío");
            return;
        }
        const { id_usuario, id_direccion } = dirSel;
        if (!id_usuario) {
            setError("Usuario inválido");
            return;
        }
        if (!medioPago) {
            setError("Debes seleccionar un método de pago");
            return;
        }
        if (!carrito.length) {
            setError("Tu carrito está vacío");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const payload = {
                id_usuario: Number(id_usuario),
                id_direccion: Number(id_direccion),
                id_medio_pago: Number(medioPago),
                total: totalFinal,
                items: carrito.map(({ id_producto, cantidad, precio }) => ({
                    id_producto,
                    cantidad,
                    precio_unitario: precio
                }))
            };

            const endpointOrdenes = await urlDB("api/ordenes");
            const res = await fetch(endpointOrdenes, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const { error: msg } = await res.json();
                throw new Error(msg || "Error al procesar la orden");
            }

            clearCart();
            Swal.fire({
                title: "Pago realizado",
                text: "Tu orden ha sido procesada exitosamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/");
                }
            });
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-4">
            <h2 className="mb-4">Confirmar Pago</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header bg-primary text-white">Métodos de Pago</div>
                        <div className="card-body">
                            {medios.map((m) => (
                                <div key={m.id_medio} className="form-check mb-2">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="metodoPago"
                                        value={m.id_medio}
                                        checked={medioPago === String(m.id_medio)}
                                        onChange={(e) => setMedioPago(e.target.value)}
                                        disabled={loading}
                                    />
                                    <label className="form-check-label">{m.nombre_medio}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card mb-4">
                        <div className="card-header bg-secondary text-white">Dirección de Envío</div>
                        <div className="card-body">
                            {dirSel ? (
                                <>
                                    <p><strong>Dirección:</strong> {dirSel.direccion}</p>
                                    <p><strong>Código Postal:</strong> {dirSel.codigo_postal}</p>
                                    <p><strong>Ciudad:</strong> {dirSel.ciudad}</p>
                                    <p><strong>País:</strong> {dirSel.pais}</p>
                                    <p><strong>Lugar de Entrega:</strong> {dirSel.lugar_entrega}</p>
                                </>
                            ) : (
                                <p>No hay dirección seleccionada.</p>
                            )}
                        </div>
                    </div>
                    <div className="card mb-4">
                        <div className="card-header bg-dark text-white">Productos</div>
                        <div className="card-body">
                            {carrito.map((p) => (
                                <div key={p.id_producto} className="d-flex justify-content-between border-bottom py-1">
                                    <span>{p.nombre}</span>
                                    <span>{p.cantidad}×</span>
                                    <span>${(p.precio * p.cantidad).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Resumen
                    carrito={carrito}
                    taxRate={0.19}
                    loading={loading}
                    medioPago={medioPago}
                    dirSel={dirSel}
                    step="payment"
                    onNext={confirmarPago}
                    onBack={onBack}
                    onConfirm={confirmarPago}
                />
            </div>
        </div>
    );
}
