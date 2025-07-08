import { useState, useEffect, useContext } from "react";
import { CartContext } from "../../../pages/Context/CartContext";
import "../../../assets/css/PasoEnvio.css";

export default function PasoEnvio({ onNext, onBack }) {
    const { carrito } = useContext(CartContext);

    // Totales del carrito
    const totalCantidad = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    const subtotal = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    const envio = 8000;
    const impuestos = Math.round(subtotal * 0.16);
    const totalFinal = subtotal + envio + impuestos;

    // Datos de envío
    const [usuario, setUsuario] = useState(null);
    const [direccion, setDireccion] = useState("");
    const [codigoPostal, setCodigoPostal] = useState("");
    const [idUbicacion, setIdUbicacion] = useState("");
    const [lugarEntrega, setLugarEntrega] = useState("Casa");
    const [error, setError] = useState("");

    // Cargo el usuario desde localStorage
    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("user"));
        if (u?.id) setUsuario(u);
    }, []);

    const handleContinuar = () => {
        if (
            !direccion.trim() ||
            !codigoPostal.trim() ||
            !idUbicacion.trim() ||
            isNaN(Number(idUbicacion))
        ) {
            setError("Completa todos los campos correctamente.");
            return;
        }
        setError("");

        const dirObj = {
            id_usuario: usuario.id,
            id_direccion: null, // se asigna en el backend si guardás en la DB
            direccion: direccion.trim(),
            codigo_postal: codigoPostal.trim(),
            id_ubicacion: Number(idUbicacion),
            lugar_entrega: lugarEntrega
        };

        localStorage.setItem(
            "direccionSeleccionada",
            JSON.stringify(dirObj)
        );
        onNext();
    };

    return (
        <div className="contenedor-general">
            <h2 className="titulo-principal">Información de Envío</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="seccion-carrito">
                {/* ─── COLUMNA IZQUIERDA: FORMULARIO DE ENVÍO ───────────────── */}
                <div className="area-productos">
                    <div className="form-group">
                        <label>Dirección</label>
                        <input
                            type="text"
                            value={direccion}
                            onChange={e => setDireccion(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Código Postal</label>
                        <input
                            type="text"
                            value={codigoPostal}
                            onChange={e => setCodigoPostal(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>ID Ubicación</label>
                        <input
                            type="number"
                            value={idUbicacion}
                            onChange={e => setIdUbicacion(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Lugar de Entrega</label>
                        <select
                            value={lugarEntrega}
                            onChange={e => setLugarEntrega(e.target.value)}
                        >
                            <option value="Casa">Casa</option>
                            <option value="Apartamento">Apartamento</option>
                            <option value="Hotel">Hotel</option>
                            <option value="Oficina">Oficina</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <button
                        className="boton-continuar"
                        onClick={handleContinuar}
                    >
                        Continuar con Pago
                    </button>
                </div>

                {/* ─── COLUMNA DERECHA: RESUMEN DEL PEDIDO ─────────────────── */}
                <div className="area-resumen">
                    <h3 className="titulo-resumen">Detalle del Pedido</h3>
                    <p>Productos: {totalCantidad}</p>
                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                    <p>Envío: ${envio.toFixed(2)}</p>
                    <p>Impuestos: ${impuestos.toFixed(2)}</p>
                    <hr />
                    <p className="total-compra">Total: ${totalFinal.toFixed(2)}</p>

                    <div className="navegacion-pasos mt-2">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={onBack}
                        >
                            ← Atrás al carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
