import { useNavigate } from 'react-router';
import { useModal } from '../../../pages/Context/ModalContext';
import { useEffect, useState } from 'react';

const LoginModal = () => {
  const { loginModalRef } = useModal();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const opciones = [
    { label: 'Iniciar sesión', to: '/login' },
    { label: 'Crear cuenta', to: '/register' },
  ];

  useEffect(() => {
    const modalEl = loginModalRef.current;
    if (!modalEl) return;

    const handleShown = () => setIsOpen(true);
    const handleHidden = () => {
      setIsOpen(false);
      // quitar foco del botón que lo cerró
      if (document.activeElement) {
        document.activeElement.blur();
      }
    };

    // Bootstrap events
    modalEl.addEventListener('shown.bs.modal', handleShown);
    modalEl.addEventListener('hidden.bs.modal', handleHidden);

    return () => {
      modalEl.removeEventListener('shown.bs.modal', handleShown);
      modalEl.removeEventListener('hidden.bs.modal', handleHidden);
    };
  }, [loginModalRef]);

  return (
    <div
      id="login-modal"
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="loginModalLabel"
      aria-hidden={!isOpen}
      inert={isOpen ? false : true}
      ref={loginModalRef}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title" id="loginModalLabel">
              Acción requerida
            </h5>

            {/* Botón cerrar */}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="modal-body text-center">
            <p className="mb-0">
              Para continuar, por favor inicia sesión o crea una cuenta.
            </p>
          </div>

          <div className="modal-footer justify-content-center gap-3">
            {opciones.map((opcion, index) => (
              <button
                key={index}
                type="button"
                className="btn btn-secondary modal-button"
                data-bs-dismiss="modal"
                onClick={() => navigate(opcion.to)}
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
