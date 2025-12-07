import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../pages/Context/AuthContext";
import logo from "../../../assets/img/logo.png";
import Buscador from "./Buscador";
import { useHeader } from "../../../pages/Context/HeaderContext.jsx";
import { useImageUrl } from "../../Hooks/useImgUrl";

export default function Header() {
    const { user, logout } = useAuth();
    const { cartCount, profileUrl, } = useHeader();
    const navigate = useNavigate();
    const imgUrlcompleta = useImageUrl(profileUrl);

    const links = [
        { to: "/Inicio", text: "Inicio" },
        { to: "/Educacion", text: "Educacion" },
        { to: "/Catalogo", text: "Catalogo" },
        { to: "/Personal", text: "Personal" },
        { to: "/Carrito", text: "Tu Carrito", isCart: true },
    ];

    const opciones = [
        { to: "/", text: "Cerrar sesión", action: () => { logout() } },
        ...(user?.role === 1
            ? [{ to: "/administrador", text: "Administrador" }]
            : user?.role === 2
                ? [{ to: "/Moderador", text: "Moderador" }]
                : []),
        { to: "/Informacion-Personal", text: "Información personal" },
        { to: "#", text: "Referidos" },
        { to: "#", text: "Descargar APP" },
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
                <NavLink to="/" className="logo">
                    <img src={logo} alt="logo" />
                </NavLink>

                {/* Buscador */}
                <Buscador />

                {/* Navegación */}
                <nav className="nav-general">
                    {links.map((link) =>
                        link.isCart ? (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `nav-link cart${isActive ? " nav-selec" : ""}`
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
                                    `nav-link${isActive ? " nav-selec" : ""}`
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
                                        <img src={imgUrlcompleta} alt="Perfil" />
                                    ) : (
                                        <i className="bx bxs-user-circle" />
                                    )}
                                </div>
                            </summary>
                            <ul>
                                {opciones.map((opt) => (
                                    <li key={opt.text}>
                                        {opt.action ? (
                                            <button
                                                onClick={() => {
                                                    localStorage.removeItem("token")
                                                    navigate("/educacion");
                                                }}
                                                id={opt.text.replace(/\s+/g, "")}
                                            >
                                                {opt.text}
                                            </button>
                                        ) : (
                                            <NavLink
                                                to={opt.to}
                                                id={opt.text.replace(/\s+/g, "")}
                                            >
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
