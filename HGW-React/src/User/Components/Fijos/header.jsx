import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../pages/Context/AuthContext';
import { findWorkingBaseUrl, urlDB } from '../../../urlDB';
// logo HGW
import logo from '../../../assets/img/logo.png';

export default function Header() {
    const { user, logout } = useAuth();

    const [cartCount, setCartCount] = useState(0);
    const [profileUrl, setProfileUrl] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchDatos = async () => {
            try {
                const endpoint = `/api/header?id=${user.id}`;
                const urlFetch = await urlDB(endpoint);
                const res = await fetch(urlFetch);
                const data = await res.json();

                if (data.success) {
                    setCartCount(data.user.total_carrito ?? 0);

                    const profileUrl = (data.user.url_foto_perfil ?? null);

                    if (profileUrl) {
                        const baseUrl = await findWorkingBaseUrl();
                        const fullProfileUrl = `${baseUrl.replace(/\/$/, '')}/${profileUrl.replace(/^\//, '')}`;
                        setProfileUrl(fullProfileUrl);
                    }
                } else {
                    console.warn("No se pudo cargar usuario:", data.message);
                }
            }catch (error) {
                console.error("Error al cargar datos de usuario:", error);
            }
        };

        fetchDatos();
        }, [user]);


    const links = [
        { to: '/Inicio', text: 'Inicio' },
        { to: '/Educacion', text: 'Educacion' },
        { to: '/Catalogo', text: 'Catalogo' },
        { to: '/Personal', text: 'Personal' },
        { to: '/Carrito', text: 'Tu Carrito', isCart: true },
    ];

    const opciones = [
        { to: '/', text: 'Cerrar sesión', action: () => logout() },
        ...(user?.role === 1 || user?.role === 2
        ? [{ to: '/Admin', text: 'Administrador' }]
        : []),
        { to: '/Informacion-Personal', text: 'Información personal' },
        { to: '#', text: 'Referidos' },
        { to: '#', text: 'Descargar APP' },
    ];

    return (
        <header>
            {/* Botón menú móvil */}
            <input type="checkbox" id="btn-header" />
            <label htmlFor="btn-header" className="btn-header">
                <i className="bx bx-menu" />
            </label>
            <h2>HGW</h2>
            <div className="header-content">
                {/* Logo */}
                <div className="logo">
                    <img src={logo} alt="logo" />
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
                            <i className="bx bx-search" />
                        </button>
                    </form>
                </div>

                {/* Navegación */}
                <nav className="nav-general">
                    {links.map((link) =>
                        link.isCart ? (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                            `nav-link cart${isActive ? ' nav-selec' : ''}`
                            }
                        >
                            <i className="bx bx-cart" />
                            <span className="cart-count">{cartCount}</span>
                        </NavLink>
                        ) : (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                            `nav-link${isActive ? ' nav-selec' : ''}`
                            }
                        >
                            {link.text}
                        </NavLink>
                        )
                    )}

                    {/* Perfil desplegable */}
                    <div className="desplegable">
                        <details className="contenedor-personal">
                            <summary className="personal">
                                <div className="personal-img">
                                {profileUrl ? (
                                    <img src={profileUrl} alt="Perfil" />
                                ) : (
                                    <i className="bx bxs-user-circle" />
                                )}
                                </div>
                            </summary>
                            <ul>
                                {opciones.map((opt) => (
                                    <li key={opt.text}>
                                        {opt.action ? (
                                            <button onClick={opt.action} id={opt.text.replace(/\s+/g, '')}>
                                                {opt.text}
                                            </button>
                                        ) : (
                                            <NavLink to={opt.to} id={opt.text.replace(/\s+/g, '')}>
                                                {opt.text}
                                            </NavLink>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </div>
                </nav>

                
            </div>
        </header>
    );
}
