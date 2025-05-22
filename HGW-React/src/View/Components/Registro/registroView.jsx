import RegistroForm from "./registroForm";
import { useRegistro } from "../../hooks/useRegistro";
import "../../../assets/css/fijos/registro.css";
import Swal from "sweetalert2";

export default function RegistroView() {
    const {
        step,
        formData,
        handleChange,
        avanzar,
        retroceder,
        validateStep,
        previewFoto,
        ciudadesFiltradas,
        setStep,
    } = useRegistro();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateStep(1) && validateStep(2) && validateStep(3)) {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            try {
                const response = await fetch("http://127.0.0.1:5000/register", {
                    method: "POST",
                    body: formDataToSend,
                });

                if (response.ok) {
                    Swal.fire("¡Registro enviado!", "Tus datos fueron enviados correctamente.", "success");
                } else {
                    const data = await response.json();
                    Swal.fire("Error", data.message || "No se pudo registrar. Intenta más tarde.", "error");
                }
            } catch (error) {
                console.error("Error en el registro:", error);
                Swal.fire("Error", "Error de conexión con el servidor.", "error");
            }
        } else {
            Swal.fire("Error", "Completa todos los pasos antes de enviar.", "error");
        }
    };

    const cambiarPaso = (destino) => {
        let valido = true;
        for (let i = 1; i < destino; i++) {
            if (!validateStep(i)) {
                valido = false;
                break;
            }
        }
        if (valido) setStep(destino);
        else Swal.fire("Error", "Completa los pasos anteriores antes de continuar.", "warning");
    };

    return (
        <main className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 sidebar">
                    <h2>Registro HGW</h2>
                    <p>Paso <span>{step}</span></p>
                    <p>Ingresa tus datos personales</p>
                    <a
                        href="#"
                        className={`sidebar-link ${step === 1 ? "active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setStep(1);
                        }}
                    >
                        Información Personal
                    </a>
                    <a
                        href="#"
                        className={`sidebar-link ${step === 2 ? "active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            cambiarPaso(2);
                        }}
                    >
                        Datos de Envío
                    </a>
                    <a
                        href="#"
                        className={`sidebar-link ${step === 3 ? "active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            cambiarPaso(3);
                        }}
                    >
                        Foto de Usuario
                    </a>
                </div>

                {/* Formulario */}
                <div className="col-md-9 d-flex align-items-center">
                    <div className="container py-5">
                        <RegistroForm
                            step={step}
                            formData={formData}
                            handleChange={handleChange}
                            avanzar={avanzar}
                            retroceder={retroceder}
                            validateStep={validateStep}
                            previewFoto={previewFoto}
                            ciudadesFiltradas={ciudadesFiltradas}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
