import React from 'react';

export const Paso1InformacionPersonal = ({ formData, errors, handleInputChange }) => {
  return (
    <div className="step-container active" id="step-personal">
      <div className="form-container">
        <h2 className="mb-4">Tu Información Personal</h2>
        <p className="mb-4">Ingresa tus datos personales para acercarte a HGW</p>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="nombres" className="form-label">Nombres</label>
            <input
              type="text"
              id="nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              className={`form-control ${errors.nombres ? 'is-invalid' : ''}`}
              placeholder="Ingresa tu nombre"
              required
            />
            {errors.nombres && <div className="invalid-feedback">{errors.nombres}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="apellido" className="form-label">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
              placeholder="Ingresa tu apellido"
              required
            />
            {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="patrocinador" className="form-label">Patrocinador</label>
            <input
              type="text"
              id="patrocinador"
              name="patrocinador"
              value={formData.patrocinador}
              onChange={handleInputChange}
              className={`form-control ${errors.patrocinador ? 'is-invalid' : ''}`}
              placeholder="Ingresa tu patrocinador"
              required
            />
            {errors.patrocinador && <div className="invalid-feedback">{errors.patrocinador}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="usuario" className="form-label">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              className={`form-control ${errors.usuario ? 'is-invalid' : ''}`}
              placeholder="Ingresa tu usuario"
              required
            />
            {errors.usuario && <div className="invalid-feedback">{errors.usuario}</div>}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="contrasena" className="form-label">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleInputChange}
              className={`form-control ${errors.contrasena ? 'is-invalid' : ''}`}
              placeholder="Ingresa tu contraseña"
              required
            />
            {errors.contrasena && <div className="invalid-feedback">{errors.contrasena}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="confirmarContrasena" className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmarContrasena"
              name="confirmarContrasena"
              value={formData.confirmarContrasena}
              onChange={handleInputChange}
              className={`form-control ${errors.confirmarContrasena ? 'is-invalid' : ''}`}
              placeholder="Confirma tu contraseña"
              required
            />
            {errors.confirmarContrasena && <div className="invalid-feedback">{errors.confirmarContrasena}</div>}
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <label htmlFor="telefono" className="form-label">Número Telefónico</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
              placeholder="Ingresa tu número"
              required
            />
            {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="correo" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
              placeholder="Ingresa tu correo"
              required
            />
            {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
