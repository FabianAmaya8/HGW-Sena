import React from 'react';

export const Paso2DatosEnvio = ({ formData, errors, handleInputChange, paises, ciudades }) => {
  return (
    <div className="step-container active" id="step-envio">
      <div className="form-container">
        <h2 className="mb-4">Dirección</h2>
        <p className="mb-4">Ingresa tu dirección de envío para que los productos lleguen directo a tu casa</p>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="direccion" className="form-label">Dirección de Envío</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
              placeholder="Ingresa tu dirección"
              required
            />
            {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="codigoPostal" className="form-label">Código Postal</label>
            <input
              type="text"
              id="codigoPostal"
              name="codigo_postal"
              value={formData.codigo_postal}
              onChange={handleInputChange}
              className={`form-control ${errors.codigo_postal ? 'is-invalid' : ''}`}
              placeholder="Código Postal"
              required
            />
            {errors.codigo_postal && <div className="invalid-feedback">{errors.codigo_postal}</div>}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="lugarEntrega" className="form-label">Lugar de Entrega</label>
            <select
              id="lugarEntrega"
              name="lugar_entrega"
              value={formData.lugar_entrega}
              onChange={handleInputChange}
              className={`form-select ${errors.lugar_entrega ? 'is-invalid' : ''}`}
              required
            >
              <option value="" disabled>Seleccione lugar de entrega</option>
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Hotel">Hotel</option>
              <option value="Oficina">Oficina</option>
              <option value="Otro">Otro</option>
            </select>
            {errors.lugar_entrega && <div className="invalid-feedback">{errors.lugar_entrega}</div>}
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <label htmlFor="pais" className="form-label">País</label>
            <select
              id="pais"
              name="pais"
              value={formData.pais}
              onChange={handleInputChange}
              className={`form-select ${errors.pais ? 'is-invalid' : ''}`}
              required
            >
              <option value="" disabled>Seleccione país</option>
              {paises.map((pais) => (
                <option key={pais.id_ubicacion} value={pais.id_ubicacion}>{pais.nombre}</option>
              ))}
            </select>
            {errors.pais && <div className="invalid-feedback">{errors.pais}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="ciudad" className="form-label">Ciudad</label>
            <select
              id="ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleInputChange}
              className={`form-select ${errors.ciudad ? 'is-invalid' : ''}`}
              required
            >
              <option value="" disabled>Seleccione ciudad</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad.id_ubicacion} value={ciudad.id_ubicacion}>{ciudad.nombre}</option>
              ))}
            </select>
            {errors.ciudad && <div className="invalid-feedback">{errors.ciudad}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
