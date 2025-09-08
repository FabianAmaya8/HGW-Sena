import { useNavigate } from 'react-router';
import { useModal } from '../../../pages/Context/ModalContext';

const LoginModal = () => {
  const { loginModalRef, showLoginModal } = useModal();
  const navigate = useNavigate();

  const opciones = [
    { label: 'Iniciar sesión', to: '/login' },
    { label: 'Crear cuenta', to: '/register' },
  ]

  return (
    <div
      className="modal fade"
      id="login-modal"
      tabIndex="-1"
      aria-labelledby="loginModalLabel"
      aria-hidden="true"
      ref={loginModalRef}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title" id="loginModalLabel">Acción requerida</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="modal-body text-center">
            <p className="mb-0">Para continuar, por favor inicia sesión o crea una cuenta.</p>
          </div>

          <div className="modal-footer justify-content-center gap-3">
            {opciones.map((opcion, index) => (
              <button
                key={index}
                type="button"
                className="btn btn-secondary modal-button"
                data-bs-dismiss="modal"
                onClick={() => {navigate(opcion.to); showLoginModal();}}
              >
                {opcion.label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginModal;
