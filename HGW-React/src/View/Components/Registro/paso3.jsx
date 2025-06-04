export const Paso3FotoUsuario = ({ formData, errors, handleInputChange, handlePrevStep }) => {
  return (
    <div className="step-container active" id="step-foto">
      <div className="profile-pic-section">
        <h2 className="mb-3">Foto de Usuario</h2>
        <p className="mb-4">Sube tu foto de perfil para completar tu registro</p>

        <label htmlFor="profile-pic" className="profile-pic-container d-block mb-3">
          {formData.fotoPreview ? (
            <img
              id="preview-profile-pic"
              src={formData.fotoPreview}
              alt="Profile Picture"
              className="rounded-circle border"
            />
          ) : (
            <div className="texto-preview">
              <h5 className="text-muted">Vista previa</h5>
            </div>
          )}
        </label>

        <input
          type="file"
          className="form-control d-none"
          id="profile-pic"
          name="fotoPerfil"
          accept="image/*"
          onChange={handleInputChange}
        />
        {errors.fotoPerfil && <div className="invalid-feedback d-block">{errors.fotoPerfil}</div>}
      </div>
    </div>
  );
};
