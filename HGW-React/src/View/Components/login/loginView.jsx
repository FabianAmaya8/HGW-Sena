import { Link } from 'react-router-dom';
import '../../../assets/css/fijos/login.css';
import LoginForm from './loginForm';

const LoginView = () => {
return (
    <main className="container login-container">
        <div className="row">
            {/* Sidebar */}
            <div className="col-md-5 sidebar">
                <h2>Bienvenido a HGW</h2>
                <p>Inicia sesión para acceder a tu cuenta y disfrutar de todos nuestros servicios.</p>
                <p>Si aún no tienes una cuenta, puedes registrarte fácilmente haciendo clic en el enlace de registro.</p>

                {/* Botones de acción */}
                <div id='botonesAccion' className="mt-4 d-flex flex-column gap-2">
                    <Link to="/register" className="btn btn-outline-primary btn-login">
                        Registrarse
                    </Link>
                    <Link to="/" className="btn btn-outline-secondary btn-login">
                        Volver al inicio
                    </Link>
                </div>
            </div>

            {/* Login Form */}
            <div className="col-md-7 login-form">
                <h2 className="text-center">Iniciar Sesión</h2>
                <LoginForm />
            </div>
        </div>
    </main>
);
};

export default LoginView;
