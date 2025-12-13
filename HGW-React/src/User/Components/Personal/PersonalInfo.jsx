import { Infinity } from 'ldrs/react';
import { useImageUrl } from '../../Hooks/useImgUrl';
import usePersonalInfo from '../../Hooks/personal/usePersonalInfo';
import useUbicaciones from '../../Hooks/personal/useUbicaciones';
import { useState, useEffect } from 'react';
import ModalCambiarContrasena from './ModalCambiarContrasena';
import ModalCrearDireccion from "./ModalCrearDireccion";
import useCambiarContrasena from '../../Hooks/personal/useCambiarContrasena';
import eliminarFotoPerfil from '../../Hooks/personal/eliminarFotoPerfil';
import Swal from 'sweetalert2';
import '../../../assets/css/personal/info-personal.css';
import { useNavigate } from 'react-router';
import useDirecciones from '../../Hooks/personal/useDirecciones';

export default function PersonalInfo() {
    const {
        personal,
        loading,
        error,
        editing,
        formUsuario,
        formDireccion,
        direccionSeleccionada,
        setDireccionSeleccionada,
        seleccionarDireccion,
        handleChangeUsuario,
        handleChangeDireccion,
        handleEdit,
        handleCancel,
        updateUsuario,
        updateDireccion,
        crearDireccion,
        loadingCrearDireccion,
        refetch
    } = usePersonalInfo();

    const imgUrl = useImageUrl(personal?.url_foto_perfil);
    const navigate = useNavigate();
    const {eliminarDireccion} = useDirecciones(personal?.id_usuario);
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
    const [showModalCrear, setShowModalCrear] = useState(false);

    // 🔄 Cargar ciudades cuando se está editando y cambia el país
    useEffect(() => {
        if (editing && formDireccion.pais) {
            fetchCiudades(formDireccion.pais);
        }
    }, [editing, formDireccion.pais]);


    // Limpiar preview si cancelan edición
    useEffect(() => {
        if (!editing) setFotoPreview(null);
    }, [editing]);


    if (loading) return (
        <div className="cargando">
            <Infinity size="150" stroke="10" color="#47BF26" />
        </div>
    );

    if (error || errorUbic) return (
        <div className="cargando">
            <i className="bx bx-error"></i>
            <p>Error: {error || errorUbic}</p>
        </div>
    );

    if (!personal) return null;



    // ============================================
    // GUARDAR TODO (usuario + dirección)
    // ============================================

    const handleGuardar = async () => {
        setFeedback(null);

        try {
            // Validación dirección
            if (!formDireccion.pais || !formDireccion.ciudad || !formDireccion.lugar_entrega) {
                setFeedback({ type: "danger", msg: "País, ciudad y lugar de entrega son obligatorios." });
                return;
            }

            await updateUsuario(personal.id_usuario);
            await updateDireccion(personal.id_usuario);

            setFeedback({ type: "success", msg: "Datos actualizados correctamente." });
            setTimeout(() => setFeedback(null), 1500);

        } catch (err) {
            setFeedback({ type: "danger", msg: err.message });
        }
    };


    // ======================
    // FOTO DE PERFIL
    // ======================

    const handleFotoChange = (e) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setFotoPreview(URL.createObjectURL(file));
        }
    };

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
            {/* BOTÓN VOLVER */}
            <div className="volver">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
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

            {/* ============================================
                DATOS PERSONALES
            ============================================ */}
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
                    {/* Campos del usuario */}
                    {Object.entries(formUsuario).map(([key, value]) => (
                        <div className="col-md-6" key={key}>
                            <label className="form-label">
                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                            <input
                                type={key === 'correo_electronico' ? 'email' : 'text'}
                                className="form-control"
                                name={key}
                                value={value}
                                onChange={handleChangeUsuario}
                                readOnly={!editing}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* ============================================
                DIRECCIONES (LISTA + EDICIÓN)
            ============================================ */}
            <div className="conten-item datos-personales p-4 mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Direcciones</h4>
                </div>

                {/* LISTADO DE DIRECCIONES */}
                {!editing && (
                    <div className="row g-3 mt-2">
                        {personal.direcciones.map((dir) => (
                            <div className="col-md-6" key={dir.id_direccion}>
                                <div className="card p-3 shadow-sm">

                                    <button
                                        className="md-eliminar-btn"
                                        onClick={async () => {
                                            const result = await eliminarDireccion(dir.id_direccion);

                                            if (result.success) {
                                                Swal.fire({
                                                    icon: "success",
                                                    title: "Eliminada",
                                                    text: "La dirección fue eliminada correctamente.",
                                                    timer: 1200,
                                                    showConfirmButton: false
                                                });
                                                
                                                refetch();
                                            }
                                        }}
                                    >
                                        <i className='bx bx-trash'></i>
                                    </button>

                                    <h5 className="fw-bold mb-2">{dir.lugar_entrega}</h5>
                                    <p className="mb-1"><strong>País:</strong> {dir.pais}</p>
                                    <p className="mb-1"><strong>Ciudad:</strong> {dir.ciudad}</p>
                                    <p className="mb-1"><strong>Dirección:</strong> {dir.direccion}</p>
                                    <p className="mb-3"><strong>Código Postal:</strong> {dir.codigo_postal}</p>

                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={() => seleccionarDireccion(dir)}
                                    >
                                        Editar dirección
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Nueva dirección</h4>
                    <button className="btn btn-primary" onClick={() => setShowModalCrear(true)}>
                        Crear dirección
                    </button>
                </div>

                {/* FORMULARIO DE EDICIÓN */}
                {editing && direccionSeleccionada && (
                    <div className="mt-4">
                        <h5 className="fw-bold mb-3">
                            Editando dirección #{direccionSeleccionada.id_direccion}
                        </h5>
                        <div className="row g-3">
                            {/* PAÍS */}
                            <div className="col-md-6">
                                <label className="form-label">País</label>
                                <select
                                    className="form-control"
                                    name="pais"
                                    value={formDireccion.pais}
                                    disabled={!editing}
                                    onChange={(e) => {
                                        const pid = e.target.value;
                                        handleChangeDireccion(e);
                                        fetchCiudades(pid);
                                    }}
                                >
                                    <option value="">Seleccione un país</option>
                                    {paises.map((p) => (
                                        <option key={p.id_ubicacion} value={p.id_ubicacion}>
                                            {p.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* CIUDAD */}
                            <div className="col-md-6">
                                <label className="form-label">Ciudad</label>
                                <select
                                    className="form-control"
                                    name="ciudad"
                                    value={formDireccion.ciudad}
                                    onChange={handleChangeDireccion}
                                    disabled={!editing}
                                >
                                    <option value="">Seleccione una ciudad</option>
                                    {ciudades.map((c) => (
                                        <option key={c.id_ubicacion} value={c.id_ubicacion}>
                                            {c.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* DIRECCIÓN */}
                            <div className="col-md-6">
                                <label className="form-label">Dirección</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="direccion"
                                    value={formDireccion.direccion}
                                    disabled={!editing}
                                    onChange={handleChangeDireccion}
                                />
                            </div>

                            {/* CÓDIGO POSTAL */}
                            <div className="col-md-6">
                                <label className="form-label">Código postal</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="codigo_postal"
                                    value={formDireccion.codigo_postal}
                                    disabled={!editing}
                                    onChange={handleChangeDireccion}
                                />
                            </div>

                            {/* LUGAR ENTREGA */}
                            <div className="col-md-6">
                                <label className="form-label">Lugar de entrega</label>
                                <select
                                    className="form-control"
                                    name="lugar_entrega"
                                    value={formDireccion.lugar_entrega}
                                    disabled={!editing}
                                    onChange={handleChangeDireccion}
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
                        <div className="d-flex gap-3 mt-4">
                            <button className="btn btn-success" onClick={handleGuardar}>
                                Guardar cambios
                            </button>
                            <button className="btn btn-secondary" onClick={handleCancel}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ============================================
                FOTO / CONTRASEÑA
            ============================================ */}
            <div className="conten-item datos-personales p-4 text-center mt-4">

                <h4 className="text-start">Otros datos</h4>

                <div className="d-flex flex-column align-items-center justify-content-center">

                    <label
                        htmlFor="profile-pic"
                        className="profile-pic-container d-block mb-3"
                        style={{ cursor: editing ? "pointer" : "not-allowed" }}
                    >
                        {fotoPreview ? (
                            <img src={fotoPreview} alt="Vista previa" className="rounded-circle border" />
                        ) : personal.url_foto_perfil ? (
                            <img src={imgUrl} alt="Foto" className="rounded-circle border" />
                        ) : (
                            <div className="texto-preview rounded-circle border d-flex align-items-center justify-content-center">
                                <i className="bx bx-user" style={{ fontSize: "150px" }}></i>
                            </div>
                        )}
                    </label>

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
                            <button className="btn btn-danger" onClick={handleEliminarFoto}>
                                Eliminar foto de perfil
                            </button>
                        )}

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

                <ModalCrearDireccion
                    show={showModalCrear}
                    onClose={() => setShowModalCrear(false)}
                    loading={loadingCrearDireccion}
                    onSubmit={async (data) => {
                        await crearDireccion(data);
                        setShowModalCrear(false);
                    }}
                />
            </div>
        </main>
    );
}
