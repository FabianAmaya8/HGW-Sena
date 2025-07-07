import { useEffect, useState, useContext } from "react";
import "../../../assets/css/PasoEnvio.css";
import { CartContext } from "../../../pages/Context/CartContext";

export default function PasoEnvio({ onNext, onBack }) {
    const [usuario, setUsuario] = useState(null);
    const [direcciones, setDirecciones] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");
    const [nuevaDireccion, setNuevaDireccion] = useState({ direccion: "", codigo_postal: "", id_ubicacion: "", lugar_entrega: "Casa" });

    const { carrito } = useContext(CartContext);
    const totalCantidad = carrito.reduce((t, p) => t + p.cantidad, 0);
    const totalParcial = carrito.reduce((t, p) => t + p.precio * p.cantidad, 0);
    const costoEnvio = 8000;
    const valorImpuestos = Math.round(totalParcial * 0.16);
    const totalFinal = totalParcial + costoEnvio + valorImpuestos;

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.id) {
            setUsuario({ ...user, id_usuario: user.id });
            fetch(`http://localhost:3000/api/direcciones/${user.id}`)
                .then(r => r.json())
                .then(setDirecciones)
                .catch(err => console.error("Error al cargar direcciones:", err));
        }
    }, []);

    const manejarCambio = (e) => {
        setNuevaDireccion({ ...nuevaDireccion, [e.target.name]: e.target.value });
    };

    const validarDatos = () => {
        const { direccion, codigo_postal, id_ubicacion, lugar_entrega } = nuevaDireccion;
        if (!direccion.trim()) return setError("La dirección es requerida") || false;
        if (!codigo_postal.trim()) return setError("El código postal es requerido") || false;
        if (!id_ubicacion.trim() || isNaN(id_ubicacion)) return setError("El ID de ubicación debe ser un número válido") || false;
        if (!lugar_entrega.trim()) return setError("El lugar de entrega es requerido") || false;
        return true;
    };

    const guardarDireccion = async () => {
        if (!usuario?.id_usuario || !validarDatos()) return;

        setGuardando(true);
        const payload = { ...nuevaDireccion, id_ubicacion: parseInt(nuevaDireccion.id_ubicacion), id_usuario: usuario.id_usuario };

        try {
            const res = await fetch("http://localhost:3000/api/direcciones", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const text = await res.text();
            if (!res.ok) throw new Error(JSON.parse(text).error || `Error ${res.status}: ${text}`);
            const nueva = JSON.parse(text);
            if (!nueva.id_direccion) throw new Error("Respuesta inválida del servidor");

            setDirecciones(prev => [...prev, { ...nueva, key: `dir-${nueva.id_direccion}` }]);
            localStorage.setItem("direccionSeleccionada", JSON.stringify(nueva));
            setNuevaDireccion({ direccion: "", codigo_postal: "", id_ubicacion: "", lugar_entrega: "Casa" });
            setMostrarModal(false);
            setMensajeExito("Dirección agregada");
            setTimeout(() => setMensajeExito(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setGuardando(false);
        }
    };

    const eliminarDireccion = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/api/direcciones/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error al eliminar la dirección");
            }

            setDirecciones(prev => prev.filter(dir => dir.id_direccion !== id));
            setMensajeExito("Dirección eliminada");
            setTimeout(() => setMensajeExito(""), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    const usarDireccion = (dir) => {
        localStorage.setItem("direccionSeleccionada", JSON.stringify(dir));
        setMensajeExito("Dirección seleccionada");
        setTimeout(() => setMensajeExito(""), 3000);
        onNext?.();
    };

    const direccionSeleccionada = JSON.parse(localStorage.getItem("direccionSeleccionada"));

    return (
        <div className="contenedor-general">
            <h2 className="titulo-principal">Información de Envío</h2>

            {mensajeExito && (
                <div className="alert alert-success">{mensajeExito}</div>
            )}

            <div className="seccion-carrito">
                <div className="area-productos">
                    {direcciones.length ? (
                        <div className="lista-direcciones">
                            {direcciones.map(dir => (
                                <div key={dir.id_direccion} className={`card-direccion ${direccionSeleccionada?.id_direccion === dir.id_direccion ? "direccion-activa" : ""}`}>
                                    <p><strong>Entrega en:</strong> {dir.lugar_entrega}</p>
                                    <p><strong>Dirección:</strong> {dir.direccion}</p>
                                    <p><strong>Código postal:</strong> {dir.codigo_postal}</p>
                                    <p><strong>Ubicación:</strong> {dir.id_ubicacion}</p>
                                    <button className="btn btn-success" onClick={() => usarDireccion(dir)}>Usar esta dirección</button>
                                    <button className="btn btn-danger ms-2" onClick={() => eliminarDireccion(dir.id_direccion)}>Eliminar</button>
                                </div>
                            ))}
                        </div>
                    ) : <p>No tienes direcciones registradas.</p>}

                    <button className="btn btn-outline-primary mt-3" onClick={() => setMostrarModal(true)}>Agregar nueva dirección</button>

                    {mostrarModal && (
                        <div className="modal-direccion">
                            <h3>Agregar Nueva Dirección</h3>
                            {error && <div className="alert alert-danger">{error}</div>}

                            <textarea name="direccion" placeholder="Calle 123 #45-67" value={nuevaDireccion.direccion} onChange={manejarCambio} disabled={guardando} />
                            <input type="text" name="codigo_postal" placeholder="110011" value={nuevaDireccion.codigo_postal} onChange={manejarCambio} disabled={guardando} />
                            <input type="number" name="id_ubicacion" placeholder="1" value={nuevaDireccion.id_ubicacion} onChange={manejarCambio} disabled={guardando} />

                            <select name="lugar_entrega" value={nuevaDireccion.lugar_entrega} onChange={manejarCambio} disabled={guardando}>
                                <option value="Casa">Casa</option>
                                <option value="Apartamento">Apartamento</option>
                                <option value="Hotel">Hotel</option>
                                <option value="Oficina">Oficina</option>
                                <option value="Otro">Otro</option>
                            </select>

                            <div className="botones-modal">
                                <button className="btn btn-primary" onClick={guardarDireccion} disabled={guardando}>{guardando ? "Guardando..." : "Usar esta dirección"}</button>
                                <button className="btn btn-secondary" onClick={() => { setMostrarModal(false); setError(""); setNuevaDireccion({ direccion: "", codigo_postal: "", id_ubicacion: "", lugar_entrega: "Casa" }); }} disabled={guardando}>Cancelar</button>
                            </div>
                        </div>
                    )}

                    <div className="navegacion-pasos mt-4">
                        <button className="btn btn-outline-secondary" onClick={onBack}>← Atrás al carrito</button>
                    </div>
                </div>

                <div className="area-resumen">
                    <h3 className="titulo-resumen">Detalle del Pedido</h3>
                    <p>Productos: {totalCantidad}</p>
                    <p>Subtotal: ${totalParcial.toFixed(2)}</p>
                    <p>Envío: ${costoEnvio.toFixed(2)}</p>
                    <p>Impuestos: ${valorImpuestos.toFixed(2)}</p>
                    <hr />
                    <p className="total-compra">Total: ${totalFinal.toFixed(2)}</p>
                    <button className="boton-comprar" onClick={() => direccionSeleccionada && onNext?.()} disabled={!direccionSeleccionada}>
                        {direccionSeleccionada ? "Continuar con pago" : "Selecciona una dirección"}
                    </button>
                </div>
            </div>
        </div>
    );
}