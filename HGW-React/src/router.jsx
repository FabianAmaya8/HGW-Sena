import { createBrowserRouter } from "react-router-dom";

// Layouts
import LayoutUsuario from "./pages/layouts/LayoutUsuario";
import PrivateLayout from './pages/layouts/PrivateLayout';
import LayoutRol from "./pages/layouts/LayoutRol";

// --- Páginas de Error ---
import Error404 from "./View/Components/Error404";

// --- Páginas Públicas (para visitantes) ---
import InicioView from "./View/Components/inicio";
import ResultadoBusqueda from "./User/Components/Fijos/ResultadoBusqueda";
import LoginView from "./View/Components/login/loginView";
import RegistroForm from "./View/Components/Registro/registroForm";
import Catalogo from "./View/Components/catalogo/catalogo";

// --- Páginas Privadas (para usuarios registrados) ---
import ProductoDetalle from "./View/Components/ProductoDetalle";
import Personal from "./User/Components/Personal/Personal";
import PersonalInfo from "./User/Components/Personal/PersonalInfo";
import Ordenes from "./User/Components/Personal/Ordenes";
import Educacion from "./User/Components/Educacion/Educacion";
import CarritoMultistep from "./View/Components/carrito/CarritoMultistep";

// --- Admin ---
import Controlador from "./controlador";
import LogoutWrapper from "./View/Components/Logout";
import Red from "./User/Components/Personal/Red";


const router = createBrowserRouter([
    {
        element: <LayoutRol />,
        children: [
            { path: "/administrador/*", element: <Controlador /> },
            { path: "/moderador/*", element: <Controlador /> }
        ]
    },
    {
        // Rutas Públicas
        element: <LayoutUsuario />,
        children: [
            { path: "/",    element: <InicioView/>,},
            { path: "/search",  element: <ResultadoBusqueda />,},
            { path: "/login",   element: <LoginView />,},
            { path: "/register",    element: <RegistroForm />,},
            { path: "/catalogo",    element: <Catalogo />,},
            { path: "/producto/:id",    element: <ProductoDetalle />},
            { path: "*",     element: <Error404 />},
            { path: "/logout", element: <LogoutWrapper /> },
        ]
    },
    {
        // Rutas Privadas
        element: <PrivateLayout />,
        children: [
            { path: "/inicio", element: <InicioView /> },
            { path: "/personal", element: <Personal /> },
            { path: "/informacion-personal", element: <PersonalInfo /> },
            { path: "/mis-ordenes", element: <Ordenes /> },
            { path: "/mi-red", element: <Red /> },
            { path: "/educacion", element: <Educacion /> },
            { path: "/carrito", element: <CarritoMultistep /> },
        ]
    },
]);

export default router;
