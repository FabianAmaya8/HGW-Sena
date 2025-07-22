import React, { useEffect } from 'react';
import { useModal } from '../../pages/Context/ModalContext';
import Buscador from '../../User/Components/Fijos/Buscador';

// Imagenes logo
import logo from '../../assets/img/logo.png';
import { Link } from 'react-router';

const HeaderView = () => {
    const { showLoginModal } = useModal();

    useEffect(() => {
        const enlace = document.getElementById('loginModal');
        if (enlace) {
            enlace.addEventListener('click', (e) => {
                e.preventDefault();
            showLoginModal();
            });
        }
        return () => {
            if (enlace) enlace.removeEventListener('click', showLoginModal);
        };
    }, [showLoginModal]);

    return (
        <header>
            <input type="checkbox" id="btn-header" />
            <label htmlFor="btn-header" className="btn-header">
                <i className="bx bx-menu"></i>
            </label>
            <h2>HGW</h2>

            <div className="header-content">
                {/* Logo */}
                <div className="logo">
                <img src={logo} className="logo" alt="logo" />
                </div>

                {/* Buscador */}
                <Buscador />

                {/* Navegación */}
                <nav className="nav-general">
                    <Link to="/" className="nav-link">Inicio</Link>
                    <Link to="/catalogo" className="nav-link">Catalogo</Link>

                    {/* Desplegable */}
                    <div className="desplegable">
                        <details className="contenedor-personal">
                        <summary className="personal">
                            <div className="personal-img">
                            <i className="bx bxs-user-circle"></i>
                            </div>
                        </summary>
                        <ul>
                            <li><a href="#" id="loginModal">Login</a></li>
                            <li><a href="#">Descargar APP</a></li>
                        </ul>
                        </details>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default HeaderView;
