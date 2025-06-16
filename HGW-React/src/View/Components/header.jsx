import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useModal } from '../../pages/Context/ModalContext';

// Imagenes logo
import logo from '../../assets/img/logo.png';

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
                <div className="buscardor">
                    <form>
                        <input
                        className="buscador-tex"
                        id="buscador"
                        type="text"
                        placeholder="Buscador"
                        />
                        <button className="buscador-btn" type="submit">
                        <i className="bx bx-search"></i>
                        </button>
                    </form>
                </div>

                {/* Navegación */}
                <nav className="nav-general">
                    <a href="/" className="nav-link">Inicio</a>
                    <a href="/ViewCatalogo" className="nav-link">Catalogo</a>

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
