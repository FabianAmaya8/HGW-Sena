import useLoginForm from '../../hooks/useLoginForm';

const LoginForm = () => {
const {
    usuario, setUsuario,
    contrasena, setContrasena,
    showPassword, togglePassword,
    handleSubmit, loading
} = useLoginForm();

return (
    <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="usuario" className="form-label">Usuario</label>
            <input
            type="text"
            id="usuario"
            className="form-control"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            placeholder="Ingresa tu usuario o correo"
            required
            />
        </div>

        <div className="form-group">
            <label htmlFor="contrasena" className="form-label">Contraseña</label>
            <div className="input-with-icon">
                <input
                    type={showPassword ? "text" : "password"}
                    id="contrasena"
                    className="form-control"
                    value={contrasena}
                    onChange={e => setContrasena(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    required
                />
                <i
                    className={`bx ${showPassword ? "bx-show" : "bx-hide"}`}
                    onClick={togglePassword}
                    style={{ cursor: 'pointer' }}
                ></i>
            </div>
        </div>

        <button
            type="submit"
            id="btn-ingresar"
            className="btn btn-login"
            disabled={loading}
        >
            {loading ? "Verificando..." : "Iniciar Sesión"}
        </button>
    </form>
);
};

export default LoginForm;
