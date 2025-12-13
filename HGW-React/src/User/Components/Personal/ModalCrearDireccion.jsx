import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import useUbicaciones from "../../Hooks/personal/useUbicaciones";
import "../../../assets/css/personal/modalCrearDireccion.css";

export default function ModalCrearDireccion({ show, onClose, onSubmit, loading = false }) {
    const { paises, ciudades, fetchCiudades, loading: loadingUbic, error: errorUbic } = useUbicaciones();

    const [form, setForm] = useState({
        pais: "",
        ciudad: "",
        direccion: "",
        codigo_postal: "",
        lugar_entrega: ""
    });

    const [feedback, setFeedback] = useState(null);

    // Resetear formulario al abrir
    useEffect(() => {
        if (show) {
            setForm({
                pais: "",
                ciudad: "",
                direccion: "",
                codigo_postal: "",
                lugar_entrega: ""
            });
            setFeedback(null);
        }
    }, [show]);

    // Cargar ciudades al cambiar país
    useEffect(() => {
        if (form.pais) {
            fetchCiudades(form.pais);
            if (form.ciudad !== "") {
                setForm(prev => ({ ...prev, ciudad: "" }));
            }
        }
    }, [form.pais, fetchCiudades]);


    // Cerrar con ESC
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape" && show) onClose();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [show, onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        if (!form.pais) return "Seleccione un país.";
        if (!form.ciudad) return "Seleccione una ciudad.";
        if (!form.direccion || form.direccion.trim().length < 3)
            return "Ingrese una dirección válida.";
        if (!form.lugar_entrega) return "Seleccione un lugar de entrega.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback(null);

        const err = validate();
        if (err) {
            setFeedback({ type: "danger", msg: err });
            return;
        }

        try {
            await onSubmit({
                pais: paises.find(p => String(p.id_ubicacion) === String(form.pais))?.nombre || "",
                ciudad: ciudades.find(c => String(c.id_ubicacion) === String(form.ciudad))?.nombre || "",
                direccion: form.direccion,
                codigo_postal: form.codigo_postal,
                lugar_entrega: form.lugar_entrega
            });

            setFeedback({ type: "success", msg: "Dirección creada correctamente." });

            setTimeout(() => {
                setFeedback(null);
                onClose();
            }, 900);

        } catch (err) {
            setFeedback({ type: "danger", msg: err?.message || "Error al crear la dirección." });
        }
    };

    // Si no está abierto → nada
    if (!show) return null;

    // ⚠️ SE AGREGA PORTAL AQUÍ COMO EN "Referidos"
    return ReactDOM.createPortal(
        (
            <div className="md-crear-direc-backdrop">

                <div className="md-crear-direc-modal">

                    {/* HEADER */}
                    <div className="md-crear-direc-header">
                        <h3 className="md-crear-direc-title">Crear nueva dirección</h3>
                        <button
                            type="button"
                            className="md-crear-direc-close"
                            onClick={onClose}
                        >
                            ×
                        </button>
                    </div>

                    {/* BODY */}
                    <div className="md-crear-direc-body">
                        <form className="md-crear-direc-form" onSubmit={handleSubmit}>

                            <div className="md-crear-direc-row">
                                <label className="md-crear-direc-label">País</label>
                                <select
                                    name="pais"
                                    value={form.pais}
                                    onChange={handleChange}
                                    className="md-crear-direc-select"
                                    required
                                >
                                    <option value="">Seleccione un país</option>
                                    {paises.map(p => (
                                        <option key={p.id_ubicacion} value={p.id_ubicacion}>
                                            {p.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md-crear-direc-row">
                                <label className="md-crear-direc-label">Ciudad</label>
                                <select
                                    name="ciudad"
                                    value={form.ciudad}
                                    onChange={handleChange}
                                    className="md-crear-direc-select"
                                    disabled={!form.pais || loadingUbic}
                                    required
                                >
                                    <option value="">
                                        {loadingUbic ? "Cargando ciudades..." : "Seleccione una ciudad"}
                                    </option>
                                    {ciudades.map(c => (
                                        <option key={c.id_ubicacion} value={c.id_ubicacion}>
                                            {c.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md-crear-direc-row">
                                <label className="md-crear-direc-label">Dirección</label>
                                <input
                                    type="text"
                                    name="direccion"
                                    className="md-crear-direc-input"
                                    value={form.direccion}
                                    onChange={handleChange}
                                    placeholder="Ej: Calle 123 #45-67"
                                    required
                                />
                            </div>

                            <div className="md-crear-direc-row">
                                <label className="md-crear-direc-label">Código postal (opcional)</label>
                                <input
                                    type="text"
                                    name="codigo_postal"
                                    className="md-crear-direc-input"
                                    value={form.codigo_postal}
                                    onChange={handleChange}
                                    placeholder="Ej: 110761"
                                />
                            </div>

                            <div className="md-crear-direc-row">
                                <label className="md-crear-direc-label">Lugar de entrega</label>
                                <select
                                    name="lugar_entrega"
                                    className="md-crear-direc-select"
                                    value={form.lugar_entrega}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="Casa">Casa</option>
                                    <option value="Apartamento">Apartamento</option>
                                    <option value="Hotel">Hotel</option>
                                    <option value="Oficina">Oficina</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                            {feedback && (
                                <div className={`md-crear-direc-feedback md-crear-direc-feedback-${feedback.type}`}>
                                    {feedback.msg}
                                </div>
                            )}

                            {errorUbic && (
                                <div className="md-crear-direc-feedback md-crear-direc-feedback-danger">
                                    Error cargando ubicaciones
                                </div>
                            )}

                            {/* FOOTER */}
                            <div className="md-crear-direc-footer">
                                <button
                                    type="button"
                                    className="md-crear-direc-btn md-crear-direc-btn-secondary"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="md-crear-direc-btn md-crear-direc-btn-primary"
                                    disabled={loading || loadingUbic}
                                >
                                    {loading ? "Creando..." : "Crear dirección"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        ),
        document.body
    );
}
