import React from "react";

export default function RegistroForm({
    step,
    formData,
    handleChange,
    avanzar,
    retroceder,
    validateStep,
    previewFoto,
    ciudadesFiltradas,
    onSubmit,
}) {
    const handleAvanzar = (e) => {
        e.preventDefault();
        if (validateStep(step)) avanzar();
    };

    const handleRetroceder = (e) => {
        e.preventDefault();
        retroceder();
    };

    return (
        <form encType="multipart/form-data" onSubmit={onSubmit}>
            {step === 1 && (
                <div>
                    <h3>Información Personal</h3>
                    <div className="form-group">
                        <label>Nombres</label>
                        <input
                            type="text"
                            name="nombres"
                            value={formData.nombres}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Apellidos</label>
                        <input
                            type="text"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="contrasena"
                            value={formData.contrasena}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirmar Contraseña</label>
                        <input
                            type="password"
                            name="confirmarContrasena"
                            value={formData.confirmarContrasena}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h3>Datos de Envío</h3>
                    <div className="form-group">
                        <label>Dirección</label>
                        <input
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Departamento</label>
                        <select
                            name="departamento"
                            value={formData.departamento}
                            onChange={handleChange}
                            className="form-control"
                            required
                        >
                            <option value="">Seleccione un departamento</option>
                            <option value="Cundinamarca">Cundinamarca</option>
                            <option value="Antioquia">Antioquia</option>
                            {/* Agrega más departamentos si es necesario */}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Ciudad</label>
                        <select
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleChange}
                            className="form-control"
                            required
                        >
                            <option value="">Seleccione una ciudad</option>
                            {ciudadesFiltradas.map((ciudad, index) => (
                                <option key={index} value={ciudad}>
                                    {ciudad}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Teléfono</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                    <h3>Foto de Usuario</h3>
                    <div className="form-group">
                        <label>Foto</label>
                        <input
                            type="file"
                            name="foto"
                            accept="image/*"
                            onChange={previewFoto}
                            className="form-control"
                        />
                    </div>
                    {formData.fotoPreview && (
                        <div className="mt-3">
                            <img
                                src={formData.fotoPreview}
                                alt="Vista previa"
                                className="img-thumbnail"
                                width="200"
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 d-flex justify-content-between">
                {step > 1 && (
                    <button className="btn btn-secondary" onClick={handleRetroceder}>
                        Atrás
                    </button>
                )}
                {step < 3 && (
                    <button className="btn btn-primary" onClick={handleAvanzar}>
                        Siguiente
                    </button>
                )}
                {step === 3 && (
                    <button type="submit" className="btn btn-success">
                        Enviar Registro
                    </button>
                )}
            </div>
        </form>
    );
}
