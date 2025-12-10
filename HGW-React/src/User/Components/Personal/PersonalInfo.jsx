import { Infinity } from 'ldrs/react';
import { useImageUrl } from '../../Hooks/useImgUrl';
import usePersonalInfo from '../../Hooks/personal/usePersonalInfo';
import useUbicaciones from '../../Hooks/personal/useUbicaciones';
import { useState, useEffect } from 'react';
import ModalCambiarContrasena from './ModalCambiarContrasena';
import useCambiarContrasena from '../../Hooks/personal/useCambiarContrasena';
import eliminarFotoPerfil from '../../Hooks/personal/eliminarFotoPerfil';
import Swal from 'sweetalert2';
import '../../../assets/css/personal/info-personal.css';

export default function PersonalInfo() {
    const {
        personal,
        loading,
        error,
        editing,
        formData,
        setFormData,
        handleChange,
        handleEdit,
        handleCancel,
        handleSubmit
    } = usePersonalInfo();
    const imgUrl = useImageUrl(personal?.url_foto_perfil);
    const {
        paises,
        ciudades,
        fetchCiudades,
        loading: loadingUbic,
        error: errorUbic
    } = useUbicaciones();

    const { cambiarContrasena, loading: loadingCambio, feedback: feedbackCambio, setFeedback: setFeedbackCambio } =
        useCambiarContrasena(personal?.id_usuario);

    const [showModal, setShowModal] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);

    // Cuando comienza edición — cargar ciudades del país actual
    useEffect(() => {
        if (editing && formData.pais) {
            fetchCiudades(formData.pais);
        }
    }, [editing, formData.pais]);

    // Limpiar preview al cancelar edición
    useEffect(() => {
        if (!editing) setFotoPreview(null);
    }, [editing]);

    if (loading) {
        return (
            <div className="cargando">
                <Infinity size="150" stroke="10" color="#47BF26" />
            </div>
        );
    }

    if (error || errorUbic) {
        return (
            <div className="cargando">
                <i className="bx bx-error"></i>
                <p>Error: {error || errorUbic}</p>
            </div>
        );
    }

    if (!personal) return null;


    // VALIDAR Y GUARDAR
    const handleGuardar = async () => {
        if (!formData.pais || !formData.ciudad || !formData.lugar_entrega) {
            setFeedback({ type: 'danger', msg: 'País, ciudad y lugar de entrega son obligatorios.' });
            return;
        }
        setFeedback(null);
        await handleSubmit(personal.id_usuario);
    };

    // Subir foto
    const handleFotoChange = (e) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, foto_perfil: file }));
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    // Eliminar foto
    const handleEliminarFoto = async () => {
        try {
            const result = await eliminarFotoPerfil(personal.id_usuario);
            if (!result.cancelled) {
                setFotoPreview(null);
                setFeedback({ type: 'success', msg: 'Foto eliminada.' });
                setTimeout(() => window.location.reload(), 900);
            }
        } catch (err) {
            setFeedback({ type: 'danger', msg: err.message });
        }
    };

    return (
        <main className="contenido container">
            <div className="volver">
                <button className="btn btn-secondary" onClick={() => window.history.back()}>
                    <i className='bx bx-left-arrow-alt'></i> Volver
                </button>
            </div>
            {/* PERFIL */}
            <div className="perfil d-flex align-items-center mb-4">
                <div className="img-perfil me-4">
                    {fotoPreview ? (
                        <img src={fotoPreview} alt="Preview" />
                    ) : personal.url_foto_perfil ? (
                        <img src={imgUrl} alt="Foto" />
                    ) : (
                        <i className='bx bx-user'></i>
                    )}
                </div>
                <div>
                    <h3>{personal.nombre_usuario}</h3>
                    <p>Membresía: {personal.membresia?.nombre_membresia}</p>
                </div>
            </div>
            {/* DATOS PERSONALES */}
            <div className="conten-item datos-personales p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Datos personales</h4>
                    {!editing ? (
                        <button className="btn btn-primary" onClick={handleEdit}>Editar</button>
                    ) : (
                        <>
                            <button className="btn btn-success me-2" onClick={handleGuardar}>Guardar</button>
                            <button className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                        </>
                    )}
                </div>
                <div className="row g-3">
                    {/* Campos automáticos */}
                    {Object.entries(formData).map(([key, value]) => {
                        if (['pais', 'ciudad', 'lugar_entrega', 'foto_perfil'].includes(key)) return null;
                        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        return (
                            <div className="col-md-6" key={key}>
                                <label className="form-label">{label}</label>
                                <input
                                    type={key === 'correo_electronico' ? 'email' : 'text'}
                                    className="form-control"
                                    name={key}
                                    value={value}
                                    onChange={handleChange}
                                    readOnly={!editing}
                                />
                            </div>
                        );
                    })}
                    {/* PAÍS */}
                    <div className="col-md-6">
                        <label className="form-label">País</label>
                        <select
                            className="form-control"
                            name="pais"
                            value={formData.pais}
                            disabled={!editing}
                            onChange={(e) => {
                                const pid = e.target.value;
                                handleChange(e);
                                setFormData(prev => ({ ...prev, ciudad: '' }));
                                fetchCiudades(pid);
                            }}
                        >
                            <option value="">Seleccione un país</option>
                            {paises.map(p => (
                                <option key={p.id_ubicacion} value={p.id_ubicacion}>
                                    {p.nombre}
                                </option>
                            ))}
                        </select>
                        {loadingUbic && editing && <Infinity size="40" stroke="5" />}
                    </div>
                    {/* CIUDAD */}
                    <div className="col-md-6">
                        <label className="form-label">Ciudad</label>
                        <select
                            className="form-control"
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleChange}
                            disabled={!editing || !formData.pais || loadingUbic}
                        >
                            <option value="">Seleccione una ciudad</option>
                            {ciudades.map(c => (
                                <option key={c.id_ubicacion} value={c.id_ubicacion}>
                                    {c.nombre}
                                </option>
                            ))}
                        </select>
                        {loadingUbic && editing && <Infinity size="40" stroke="5" />}
                    </div>
                    {/* LUGAR DE ENTREGA */}
                    <div className="col-md-6">
                        <label className="form-label">Lugar de entrega</label>
                        <select
                            className="form-control"
                            name="lugar_entrega"
                            value={formData.lugar_entrega}
                            onChange={handleChange}
                            disabled={!editing}
                        >
                            <option value="">Seleccione una opción</option>
                            <option value="Casa">Casa</option>
                            <option value="Apartamento">Apartamento</option>
                            <option value="Hotel">Hotel</option>
                            <option value="Oficina">Oficina</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* FOTO / CONTRASEÑA */}
            <div className="conten-item datos-personales p-4 text-center">
                <h4 className="text-start">Otros datos</h4>
                <div className="d-flex flex-column align-items-center justify-content-center">
                    <label
                        htmlFor="profile-pic"
                        className="profile-pic-container d-block mb-3"
                        style={{ cursor: editing ? "pointer" : "not-allowed" }}
                    >
                        {fotoPreview ? (
                            <img
                                id="preview-profile-pic"
                                src={fotoPreview}
                                alt="Vista previa"
                                className="rounded-circle border"
                            />
                        ) : personal.url_foto_perfil ? (
                            <img
                                src={imgUrl}
                                alt="Foto de perfil"
                                className="rounded-circle border"
                            />
                        ) : (
                            <div className="texto-preview rounded-circle border d-flex align-items-center justify-content-center">
                                <i className="bx bx-user" style={{ fontSize: "150px" }}></i>
                            </div>
                        )}
                    </label>

                    {/* Input real (oculto visualmente) */}
                    <input
                        type="file"
                        id="profile-pic"
                        className="d-none"
                        accept="image/*"
                        disabled={!editing}
                        onChange={handleFotoChange}
                    />

                    <div className="bts d-flex flex-column align-items-center gap-2">

                        {personal.url_foto_perfil && !editing && (
                            <button
                                className="btn btn-danger"
                                type="button"
                                onClick={handleEliminarFoto}
                            >
                                Eliminar foto de perfil
                            </button>
                        )}

                        {feedback && (
                            <div className={`alert alert-${feedback.type}`}>{feedback.msg}</div>
                        )}

                        {feedbackCambio && (
                            <div className={`alert alert-${feedbackCambio.type}`}>{feedbackCambio.msg}</div>
                        )}

                        <button
                            className="btn btn-primary"
                            onClick={() => setShowModal(true)}
                        >
                            Cambiar contraseña
                        </button>
                    </div>
                </div>
                <ModalCambiarContrasena
                    show={showModal}
                    onClose={() => { setShowModal(false); setFeedbackCambio(null); }}
                    onSubmit={async (form) => {
                        await cambiarContrasena({ actual: form.actual, nueva: form.nueva });
                    }}
                    loading={loadingCambio}
                />
            </div>
        </main>
    );
}
