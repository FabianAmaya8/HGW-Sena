import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../pages/Context/AuthContext";
import { useModal } from "../../../pages/Context/ModalContext";
import { useHeader } from "../../../pages/Context/HeaderContext.jsx";
import { useImageUrl } from "../../Hooks/useImgUrl";
import Buscador from "./Buscador";
import logo from "../../../assets/img/logo.png";
import { useState } from "react";
import { isLoggedIn } from "../../../auth.js";
import Referidos from "./Referidos.jsx";

export default function Header() {
    const { user, logout } = useAuth();
    const { showLoginModal } = useModal();
    const { cartCount, profileUrl, username } = useHeader();
    const navigate = useNavigate();
    const imgUrlcompleta = useImageUrl(profileUrl);

    const [refOpen, setRefOpen] = useState(false);

    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen((v) => !v);
    const closeMenu = () => setMenuOpen(false);

    const urlApp = "https://bwgufixmrvvtsfrcpuwu.supabase.co/storage/v1/object/public/imgs/Apk/HGW.apk";

    // --------------------------
    // HEADER SI NO ESTÁ LOGUEADO
    // --------------------------
    if (!isLoggedIn()) {
        return (
            <header>
                <button className="btn-header" onClick={toggleMenu}>
                    <i className="bx bx-menu"></i>
                </button>
                <h2>HGW</h2>

                <div className={`header-content ${menuOpen ? "open" : ""}`}>
                    {/* Logo */}
                    <div className="logo" onClick={closeMenu}>
                        <img src={logo} alt="logo" />
                    </div>

                    <Buscador />

                    <nav className="nav-general">
                        <Link to="/" className="nav-link" onClick={closeMenu}>
                            Inicio
                        </Link>

                        <Link
                            to="/catalogo"
                            className="nav-link"
                            onClick={closeMenu}
                        >
                            Catálogo
                        </Link>

                        <div className="desplegable">
                            <details className="contenedor-personal">
                                <summary className="personal">
                                    <div className="personal-img">
                                        <i className="bx bxs-user-circle"></i>
                                    </div>
                                </summary>

                                <ul>
                                    <li>
                                        <button
                                            type="button"
                                            className="login-btn"
                                            onClick={() => {
                                                closeMenu();
                                                showLoginModal();
                                            }}
                                        >
                                            Login
                                        </button>
                                    </li>
                                    <li><a href={urlApp}>Descargar APP</a></li>
                                </ul>
                            </details>
                        </div>
                    </nav>
                </div>
            </header>
        );
    }

    // -------------------------
    // HEADER SI ESTÁ LOGUEADO
    // -------------------------

    const links = [
        { to: "/Inicio", text: "Inicio" },
        { to: "/Educacion", text: "Educacion" },
        { to: "/Catalogo", text: "Catalogo" },
        { to: "/Personal", text: "Personal" },
        { to: "/Carrito", text: "Tu Carrito", isCart: true },
    ];

    const opciones = [
        { text: "Cerrar sesión", action: () => {
            closeMenu();
            logout();
            localStorage.removeItem("token");
            navigate("/login");
        } },
        ...(user?.role === 1
            ? [{ to: "/Administrador", text: "Administrador" }]
            : user?.role === 2
                ? [{ to: "/Moderador", text: "Moderador" }]
                : []),
        { to: "/Informacion-Personal", text: "Información personal" },
        { text: "Referidos", action: () => setRefOpen(true) },
        { to: urlApp , text: "Descargar APP" },
    ];

    return (
        <header>
            <button className="btn-header" onClick={toggleMenu}>
                <i className="bx bx-menu"></i>
            </button>
            <h2>HGW</h2>

            <div className={`header-content ${menuOpen ? "open" : ""}`}>
                {/* Logo */}
                <NavLink to="/" className="logo" onClick={closeMenu}>
                    <img src={logo} alt="logo" />
                </NavLink>

                <Buscador />

                <nav className="nav-general">
                    {links.map((link) =>
                        link.isCart ? (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `nav-link cart${isActive ? " nav-selec" : ""}`
                                }
                            >
                                <i className="bx bx-cart"></i>
                                <span className="cart-count">{cartCount}</span>
                            </NavLink>
                        ) : (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `nav-link${isActive ? " nav-selec" : ""}`
                                }
                            >
                                {link.text}
                            </NavLink>
                        )
                    )}

                    {/* Perfil */}
                    <div className="desplegable">
                        <details className="contenedor-personal">
                            <summary className="personal">
                                <div className="personal-img">
                                    {profileUrl ? (
                                        <img src={imgUrlcompleta} alt="Perfil" />
                                    ) : (
                                        <i className="bx bxs-user-circle"></i>
                                    )}
                                </div>
                            </summary>

                            <ul>
                                {opciones.map((opt) => (
                                    <li key={opt.text}>
                                        {opt.action ? (
                                            <button
                                                onClick={() => opt.action && opt.action()}
                                            >
                                                {opt.text}
                                            </button>
                                        ) : (
                                            <NavLink to={opt.to} onClick={closeMenu}>
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
            <Referidos
                refOpen={refOpen}
                setRefOpen={setRefOpen}
                user={username}
            />
        </header>
    );
}
