import { useState, useEffect } from "react";
import "../../../assets/css/PasoEnvio.css";

export default function PasoEnvio({ carrito, onNext, onBack }) {
    const totalCantidad = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    const subtotal      = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    const envio         = 8000;
    const impuestos     = Math.round(subtotal * 0.16);
    const totalFinal    = subtotal + envio + impuestos;

    const [usuario, setUsuario]       = useState(null);
    const [direccion, setDireccion]   = useState("");
    const [codigoPostal, setCP]       = useState("");
    const [idUbicacion, setIdUbic]    = useState("");
    const [lugarEntrega, setLugar]    = useState("Casa");
    const [error, setError]           = useState("");

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("user"));
        if (u?.id) setUsuario(u);
    }, []);

    const handleContinuar = () => {
        if (!direccion.trim() || !codigoPostal.trim() ||
            !idUbic.trim() || isNaN(Number(idUbic))) {
            setError("Completa todos los campos correctamente.");
            return;
        }
        setError("");
        const dirObj = {
            id_usuario: usuario.id,
            direccion: direccion.trim(),
            codigo_postal: codigoPostal.trim(),
            id_ubicacion: Number(idUbic),
            lugar_entrega: lugarEntrega
        };
        localStorage.setItem("direccionSeleccionada", JSON.stringify(dirObj));
        onNext();
    };

    return (
        <div className="contenedor-general">
            <h2 className="titulo-principal">Información de Envío</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="seccion-carrito">
                <div className="area-productos">
                    <div className="form-group">
                        <label>Dirección</label>
                        <input value={direccion} onChange={e => setDireccion(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Código Postal</label>
                        <input value={codigoPostal} onChange={e => setCP(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>ID Ubicación</label>
                        <input type="number" value={idUbic} onChange={e => setIdUbic(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Lugar de Entrega</label>
                        <select value={lugarEntrega} onChange={e => setLugar(e.target.value)}>
                            <option>Casa</option>
                            <option>Apartamento</option>
                            <option>Hotel</option>
                            <option>Oficina</option>
                            <option>Otro</option>
                        </select>
                    </div>
                    <button className="boton-continuar" onClick={handleContinuar}>
                        Continuar con Pago
                    </button>
                </div>
                <div className="area-resumen">
                    <h3 className="titulo-resumen">Detalle del Pedido</h3>
                    <p>Productos: {totalCantidad}</p>
                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                    <p>Envío: ${envio.toFixed(2)}</p>
                    <p>Impuestos: ${impuestos.toFixed(2)}</p>
                    <hr />
                    <p className="total-compra">Total: ${totalFinal.toFixed(2)}</p>
                    <button className="btn btn-outline-secondary" onClick={onBack}>
                        ← Atrás al carrito
                    </button>
                </div>
            </div>
        </div>
    );
}
