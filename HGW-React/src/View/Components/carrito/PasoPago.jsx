import { useState, useEffect } from "react";
import { urlDB } from "../../../urlDB";
import Resumen from "./Resumen";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../pages/Context/AuthContext";
import { formatPrice } from "../../hooks/useCarrito";

export default function PasoPago({ carrito, direccionSeleccionada, actualizarCantidad, clearCart, onBack }) {
    const [medios, setMedios] = useState([]);
    const [medioPago, setMedioPago] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const subtotal = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);
    const envio = 5000;
    const impuestos = Math.round(subtotal * 0.19);
    const totalFinal = subtotal + envio + impuestos;

    const dirSel = direccionSeleccionada;

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
    }, []);

    const confirmarPago = async () => {
        if (!dirSel?.id) {
            setError("Debes seleccionar una dirección de envío");
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

        setLoading(true);
        setError("");

        try {
            const payload = {
                id_usuario: user.id,
                id_direccion: Number(dirSel.id),
                id_medio_pago: Number(medioPago),
                total: totalFinal,
                items: carrito.map(p => ({
                    id_producto: p.id_producto,
                    cantidad: p.cantidad,
                    precio_unitario: p.precio
                }))
            };

            const endpointOrdenes = await urlDB("api/ordenes");
            const res = await fetch(endpointOrdenes, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            // 🟥 SI LA API REPORTA FALTA DE STOCK
            if (!res.ok && data.error === "Stock insuficiente") {

                const result = await Swal.fire({
                    icon: "error",
                    title: "Stock insuficiente",
                    html: `
                        <p><strong>Producto:</strong> ${data.producto}</p>
                        <p><strong>Solicitado:</strong> ${data.solicitado}</p>
                        <p><strong>Disponible:</strong> ${data.stock_disponible}</p>
                        <br>
                        <p>¿Deseas ajustar tu pedido al stock actual?</p>
                    `,
                    showCancelButton: true,
                    confirmButtonText: "Sí, ajustar",
                    cancelButtonText: "No",
                    reverseButtons: true
                });

                if (result.isConfirmed) {

                    await actualizarCantidad(data.id_producto, data.stock_disponible);

                    Swal.fire({
                        icon: "success",
                        title: "Pedido ajustado",
                        text: "Se actualizó la cantidad al stock disponible.",
                        timer: 1800,
                        showConfirmButton: false
                    });
                }

                setLoading(false);
                return;
            }

            // 🟥 OTROS ERRORES
            if (!res.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Error al procesar la orden",
                    text: data.error || "No se pudo completar la compra.",
                });
                setLoading(false);
                return;
            }

            // 🟩 SI TODO ESTÁ BIEN
            clearCart();
            Swal.fire({
                title: "Pago realizado",
                text: "Tu orden ha sido procesada exitosamente.",
                icon: "success"
            }).then(() => navigate("/"));

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error interno",
                text: err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2 className="mb-4">Confirmar Pago</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header bg-primary text-white">Métodos de Pago</div>
                        <div className="card-body">
                            {medios.map(m => (
                                <div key={m.id_medio} className="form-check mb-2">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="metodoPago"
                                        value={m.id_medio}
                                        checked={medioPago === String(m.id_medio)}
                                        onChange={e => setMedioPago(e.target.value)}
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
                            {carrito.map(p => (
                                <div key={p.id_producto} className="d-flex justify-content-between border-bottom py-1">
                                    <span>{p.nombre}</span>
                                    <span>{p.cantidad}×</span>
                                    <span>{formatPrice(p.precio * p.cantidad)}</span>
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
                    onBack={onBack}
                    onConfirm={confirmarPago}
                />
            </div>
        </div>
    );
}
