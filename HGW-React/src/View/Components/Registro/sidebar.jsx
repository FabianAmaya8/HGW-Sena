import { Link } from 'react-router-dom';
import { User, MapPin, Camera } from 'lucide-react';

export const Sidebar = ({ currentStep, goToStep }) => (
  <>
  <div className="col-md-3 sidebarRegister">
    <div className="infoRegistro">
      <h2>Registro HGW</h2>
      <h5>Paso <span id="current-step" className="font-weight-bold"># {currentStep}</span></h5>
      <h6>
        {{
          1: 'Ingresa tus datos personales',
          2: 'Ingresa información de envío',
          3: 'Sube tu foto de perfil'
        }[currentStep]}
      </h6>
      <div className=" flex-column mediaRegistroOFF">
        <a
          href="#"
          id="link-personal"
          onClick={() => goToStep(1)}
          className={`sidebar-link ${currentStep === 1 ? 'active' : ''}`}
        >
          <User size={16} className="mr-2" /> Información Personal
        </a>
        <a
          href="#"
          id="link-envio"
          onClick={() => goToStep(2)}
          className={`sidebar-link ${currentStep === 2 ? 'active' : ''}`}
        >
          <MapPin size={16} className="mr-2" /> Datos de envío
        </a>
        <a
          href="#"
          id="link-foto"
          onClick={() => goToStep(3)}
          className={`sidebar-link ${currentStep === 3 ? 'active' : ''}`}
        >
          <Camera size={16} className="mr-2" /> Foto de Usuario
        </a>
      </div>
    </div>
      {/* Botones de acción */}
      <div className="mt-4 flex-column gap-2 mediaRegistroOFF">
          <Link to="/login" className="btn btn-outline-primary btn-login">
              Inicio de sesión
          </Link>
          <Link to="/" className="btn btn-outline-secondary btn-login">
              Volver al inicio
          </Link>
      </div>
  </div>
  <div className="mediaRegistro botonesAccion2">
    <p className="mb-2 text-center">¿Ya tienes una cuenta?</p>
    <Link to="/login" className="btn btn-outline-primary btn-login">
        Inicio de sesión
    </Link>
    <p className="mb-2 text-center">¿Quieres volver al inicio?</p>
    <Link to="/" className="btn btn-outline-secondary btn-login">
        Volver al inicio
    </Link>
  </div>
  </>
);
