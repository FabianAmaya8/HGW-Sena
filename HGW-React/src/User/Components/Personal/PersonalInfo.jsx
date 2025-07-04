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
    const { cambiarContrasena, loading: loadingCambio, feedback: feedbackCambio, setFeedback: setFeedbackCambio } = useCambiarContrasena(personal?.id_usuario);
    const [selectedPais, setSelectedPais] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);

    // Cargar ciudades al iniciar edición (solo una vez)
    useEffect(() => {
        if (editing && personal?.direcciones?.[0]?.pais_id) {
            const pid = personal.direcciones[0].pais_id;
            setSelectedPais(pid);
            fetchCiudades(pid);
        }
    }, [editing, personal]);

    // Limpiar preview al cancelar edición
    useEffect(() => {
        if (!editing) setFotoPreview(null);
    }, [editing]);

    if (loading) {
        return (
            <div className="cargando">
                <Infinity
                    size="150"
                    stroke="10"
                    strokeLength="0.15"
                    bgOpacity="0.3"
                    speed="1.3"
                    color="#47BF26"
                />
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

    // Validación antes de submit
    const handleGuardar = async () => {
        if (!formData.pais || !formData.ciudad || !formData.lugar_entrega) {
            setFeedback({ type: 'danger', msg: 'País, ciudad y lugar de entrega son obligatorios.' });
            return;
        }
        setFeedback(null);
        await handleSubmit(personal.id_usuario);
    };

    // Cambiar foto y vista previa
    const handleFotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            handleChange({ target: { name: 'foto_perfil', value: file } });
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    // Eliminar foto de perfil
    const handleEliminarFoto = async () => {
        try {
            const result = await eliminarFotoPerfil(personal.id_usuario);
            if (result.cancelled) return;
            setFotoPreview(null);
            setFeedback({ type: 'success', msg: 'Foto de perfil eliminada.' });
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            setFeedback({ type: 'danger', msg: err.message });
        }
    };

    return (
        <main className="contenido container">
            <div className="volver">
                <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
                    <i className='bx bx-left-arrow-alt'></i> Volver
                </button>
            </div>
            <div className="perfil d-flex align-items-center mb-4">
                <div className="img-perfil me-4">
                    {personal.url_foto_perfil ? (
                        <img src={imgUrl} alt="Foto de perfil" />
                    ) : (
                        <i className='bx bx-user'></i>
                    )}
                </div>
                <div className="info-perfil">
                    <h3 className="mb-1">{personal.nombre_usuario}</h3>
                    <p className="mb-0">Membresía: {personal.membresia?.nombre_membresia}</p>
                </div>
            </div>

            {/* Contenedor de datos personales sin onSubmit */}
            <div className="conten-item datos-personales p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Datos personales</h4>
                    <div className="btns">
                        {!editing ? (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleEdit}
                            >
                                Editar
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-success me-2"
                                    onClick={handleGuardar}
                                >
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="card-body row g-3">
                    {Object.entries(formData).map(([key, value]) => {
                        if (key === 'pais' || 
                            key === 'ciudad' || 
                            key === 'lugar_entrega' ||
                            key === 'foto_perfil'
                        ) return null;
                        const label = key
                            .split('_')
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(' ');
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

                    <div className="col-md-6">
                        <label className="form-label">País</label>
                        <select
                            className="form-control"
                            name="pais"
                            value={selectedPais}
                            onChange={(e) => {
                                const pid = e.target.value;
                                setSelectedPais(pid);
                                fetchCiudades(pid);
                                handleChange({ target: { name: 'ciudad', value: '' } });
                            }}
                            disabled={!editing}
                        >
                            <option value="">Seleccione un país</option>
                            {paises.map((pais) => (
                                <option key={pais.id_ubicacion} value={pais.id_ubicacion}>
                                    {pais.nombre}
                                </option>
                            ))}
                        </select>
                        {loadingUbic && editing && <Infinity size="50" stroke="6" strokeLength="0.2" />}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Ciudad</label>
                        <select
                            className="form-control"
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleChange}
                            disabled={!editing || !selectedPais || loadingUbic}
                        >
                            <option value="">Seleccione una ciudad</option>
                            {ciudades.map((ciudad) => (
                                <option key={ciudad.id_ubicacion} value={ciudad.id_ubicacion}>
                                    {ciudad.nombre}
                                </option>
                            ))}
                        </select>
                        {loadingUbic && editing && <Infinity size="50" stroke="6" strokeLength="0.2" />}
                    </div>

                    {/* Select Lugar de Entrega */}
                    <div className="col-md-6">
                        <label className="form-label">Lugar de Entrega</label>
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
            <div className="conten-item datos-personales p-4">
                {/* Cambiar foto de perfil */}
                <div className="d-flex flex-column align-items-center justify-content-center ">
                    <h4 style={{width: '100%', textAlign: 'left'}} >Otros datos</h4>
                    <label htmlFor="profile-pic" className="profile-pic-container d-block mb-3" style={{cursor: editing ? 'pointer' : 'not-allowed'}}>
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
                                <i className='bx bx-user' style={{fontSize: '150px'}}></i>
                            </div>
                        )}
                    </label>
                    <div className="bts">
                        <input
                            type="file"
                            className="btn"
                            id="profile-pic"
                            accept="image/*"
                            disabled={!editing}
                            onChange={handleFotoChange}
                        />
                        {personal.url_foto_perfil && !editing && (
                            <button className="btn btn-danger" onClick={handleEliminarFoto} type="button">
                                Eliminar foto de perfil
                            </button>
                        )}
                        {/* Modal para cambiar contraseña */}
                        {feedback && <div className={`alert alert-${feedback.type}`}>{feedback.msg}</div>}
                        {feedbackCambio && <div className={`alert alert-${feedbackCambio.type}`}>{feedbackCambio.msg}</div>}
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
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
