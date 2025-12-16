import { useEffect } from "react";
import Swal from 'sweetalert2';
import Resumen from "./Resumen";
import { useNavigate } from "react-router-dom";

export default function PasoEnvio({
    carrito,
    direcciones,
    direccionSeleccionada,
    setDireccionSeleccionada,
    onNext,
    onBack
}) {
    const sinDirecciones = direcciones.length === 0;
    const navigation = useNavigate();

    useEffect(() => {
        if (direcciones.length > 0 && !direccionSeleccionada) {
            setDireccionSeleccionada(direcciones[0]);
        }
    }, [direcciones]);

    const handleContinuar = () => {
        if (sinDirecciones) {
            Swal.fire({
                title: "No tienes dirección de envío registrada",
                text: "Debes registrar una dirección para continuar.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ir a registrar",
                cancelButtonText: "Cancelar"
            }).then(result => {
                if (result.isConfirmed) {
                    navigation("/Informacion-Personal");
                }
            });
            return;
        }

        Swal.fire({
            title: "¿Tus datos son correctos?",
            text: "Confirma tu dirección antes de continuar.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "No"
        }).then(result => {
            if (result.isConfirmed) {
                onNext();
            }
        });
    };

    return (
        <div className="container my-4">
            <h2 className="mb-4">Información de Envío</h2>

            <div className="row">
                
                {/* LISTA DE DIRECCIONES */}
                <div className="col-md-6">
                    <div className="card mb-4">
                        <h2 className="p-3">Selecciona una dirección</h2>

                        <div className="card-body">

                            {sinDirecciones ? (
                                <p>No tienes direcciones registradas.</p>
                            ) : (
                                direcciones.map((d) => (
                                    <div
                                        key={d.id}
                                        className={`border rounded p-3 mb-3 direccion-card ${direccionSeleccionada?.id === d.id ? "bg-light border-success" : ""}`}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setDireccionSeleccionada(d)}
                                    >
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="direccion"
                                                checked={direccionSeleccionada?.id === d.id}
                                                onChange={() => setDireccionSeleccionada(d)}
                                            />
                                            <label className="form-check-label ms-2">
                                                <strong>{d.direccion}</strong>  
                                                <br />
                                                {d.ciudad}, {d.pais}
                                                <br />
                                                CP: {d.codigo_postal}
                                                <br />
                                                Entrega: {d.lugar_entrega}
                                            </label>
                                        </div>
                                    </div>
                                ))
                            )}
                        <button
                            className="btn btn-primary w-100 mt-3"
                            onClick={navigation.bind(null, "/Informacion-Personal")}
                            >
                            Agregar/Editar Dirección
                        </button>
                        </div>
                    </div>
                </div>

                {/* RESUMEN */}
                <Resumen
                    carrito={carrito}
                    loading={sinDirecciones}
                    step="shipping"
                    onNext={handleContinuar}
                    onBack={onBack}
                />
            </div>
        </div>
    );
}
