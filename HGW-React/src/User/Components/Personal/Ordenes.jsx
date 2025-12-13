import { Infinity } from "ldrs/react";
import useOrdenes from "../../Hooks/personal/useOrdenes";
import { useEffect } from "react";
import { generarPDFOrden } from "../../../View/hooks/generarPDF"; 
import "../../../assets/css/personal/ordenes.css";

export default function Ordenes() {

    const {
        ordenes,
        detalle,
        cargando,
        error,
        obtenerOrdenes,
        obtenerDetalleOrden,
        limpiarDetalle
    } = useOrdenes();

    useEffect(() => {
        obtenerOrdenes();
    }, []);

    if (cargando) {
        return (
            <div className="cargando">
                <Infinity size="120" stroke="10" color="#47BF26" />
            </div>
        );
    }

    if (error) return <p>Error: {error}</p>;

    return (
        <main className="container ordenesContent">

            <h3>Mis órdenes</h3>

            {/* CARDS */}
            <div className="ordenesItems">
                {ordenes.map((o) => (
                    <div key={o.id_orden}>
                        <div className="orden-card" onClick={() => obtenerDetalleOrden(o.id_orden)}>
                            <h5><b>Orden #{o.id_orden}</b></h5>
                            <p>Total: <b>${o.total.toLocaleString()}</b></p>
                            <p>Fecha: {o.fecha_creacion}</p>
                            <p>Método: {o.medio_pago}</p>
                            <p>Enviar a: {o.direccion}</p>
                        </div>
                    </div>
                ))}

                {ordenes.length === 0 && (
                    <p className="text-center">No tienes órdenes aún.</p>
                )}
            </div>

            {/* DETALLE */}
            {detalle && (
                <ModalOrdenDetalle
                    detalle={detalle}
                    onClose={limpiarDetalle}
                    generarPDF={generarPDFOrden}
                />
            )}
        </main>
    );
}

export function ModalOrdenDetalle({ detalle, onClose, generarPDF }) {
    if (!detalle) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-detalle" onClick={(e) => e.stopPropagation()}>
                
                <button className="modal-close" onClick={onClose}>
                    <i className='bx bx-x'></i>
                </button>

                <h3>Orden #{detalle.orden.id_orden}</h3>

                <div className="modal-section">
                    <p><b>Cliente:</b> {detalle.orden.usuario}</p>
                    <p><b>Correo:</b> {detalle.orden.correo_electronico}</p>
                    <p><b>Dirección:</b> {detalle.orden.direccion}</p>
                    <p><b>Ubicación:</b> {detalle.orden.ubicacion}</p>
                    <p><b>Fecha:</b> {detalle.orden.fecha_creacion}</p>
                </div>

                <h5>Productos</h5>

                <ul className="modal-product-list">
                    {detalle.productos.map((p, index) => (
                        <li key={index} className="modal-product-item">
                            <span>{p.nombre_producto} x{p.cantidad}</span>
                            <b>${p.subtotal.toLocaleString()}</b>
                        </li>
                    ))}
                </ul>

                <div className="modal-total">
                    <h4>Total: ${detalle.orden.total.toLocaleString()}</h4>
                </div>

                <button
                    className="btn-download"
                    onClick={() => generarPDF(detalle)}
                >
                    Descargar Factura PDF
                </button>

            </div>
        </div>
    );
}
