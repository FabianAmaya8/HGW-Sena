import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import Resumen from "./Resumen";
import { useNavigate } from "react-router";

export default function PasoEnvio({ carrito, direcciones , onNext, onBack }) {
    const [direcDisponible, setDirecDisponible] = useState(true);
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

    useEffect(() => {
        if (direcciones.length > 0) {
            setDirecDisponible(false);
        } else {
            setDirecDisponible(true);
        }
    }, []);

    const handleContinuar = () => {
        direcDisponible ?
        Swal.fire({
            title: "No tienes dirección de envío registrada",
            text: "Debes registrar tu información de envío para continuar.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Continuar",
            cancelButtonText: "No",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                useNavigate("/Informacion-Personal");
            }
        })
        :
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
                    loading={direcDisponible}
                    step="shipping"
                    onNext={handleContinuar}
                    onBack={onBack}
                />
            </div>
        </div>
    );
}
