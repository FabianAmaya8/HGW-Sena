import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import "../../../assets/css/PasoEnvio.css";
import Resumen from "./Resumen";

export default function PasoEnvio({ carrito, direcciones , onNext, onBack }) {
    const totalCantidad = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    const subtotal      = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    const envio         = 8000;
    const impuestos     = Math.round(subtotal * 0.16);
    const totalFinal    = subtotal + envio + impuestos;
    const arryDirecciones = direcciones[0];

    const [usuario, setUsuario]       = useState(arryDirecciones?.id_direccion);
    const [direccion, setDireccion]   = useState(arryDirecciones?.direccion);
    const [codigoPostal, setCP]       = useState(arryDirecciones?.codigo_postal);
    const [ciudad, setCiudad]       = useState(arryDirecciones?.ciudad);
    const [pais, setPais]           = useState(arryDirecciones?.pais);
    const [lugarEntrega, setLugar]    = useState(arryDirecciones?.lugar_entrega);
    const [error, setError]           = useState("");

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem("user"));
        if (u?.id) setUsuario(u);
    }, []);

    const handleContinuar = () => {
        Swal.fire({
            title: "¿Tus datos son correctos?",
            text: "Verifica que tu información de envío sea la adecuada.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Continuar",
            cancelButtonText: "No",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                onNext();
            }
        });
    };

    return (
        <div className="container my-4">
            <h2 className="mb-4">Información de Envío</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row">
                {/* Sección de Dirección */}
                <div className="col-md-6">
                <div className="card mb-4">
                    <h2 >Dirección de Entrega</h2>
                    <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Dirección</label>
                        <p className="form-control-plaintext border rounded p-2">{direccion || "No disponible"}</p>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Código Postal</label>
                        <p className="form-control-plaintext border rounded p-2">{codigoPostal || "No disponible"}</p>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Ciudad</label>
                        <p className="form-control-plaintext border rounded p-2">{ciudad || "No disponible"}</p>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">País</label>
                        <p className="form-control-plaintext border rounded p-2">{pais || "No disponible"}</p>
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Lugar de Entrega</label>
                        <p className="form-control-plaintext border rounded p-2">{lugarEntrega || "No disponible"}</p>
                    </div>
                    </div>
                </div>
                </div>

                <Resumen
                    carrito={carrito}
                    taxRate={0} // Ajusta según sea necesario
                    loading={false} // Cambia según tu lógica de carga
                    medioPago={null} // Ajusta según tu lógica de pago
                    dirSel={null} // Ajusta según tu lógica de dirección
                    step="shipping"
                    handleContinuar={handleContinuar}
                    onNext={onNext}
                    onBack={onBack}
                />
            </div>
        </div>

    );
}
