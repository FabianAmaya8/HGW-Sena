import { createBrowserRouter } from "react-router-dom";
// Visitante
import InicioWrapper from "./pages/View/inicioWrapper";
import Buquedapage from "./pages/User/buqueda";
import LoginPege from "./pages/View/loginPage";
import RegistroPage from "./pages/View/registroPage";
import CatalogoPage from "./pages/View/catalogoPege";
// Usuario
import Inicio from "./pages/User/InicioPege";
import PersonalPege from "./pages/User/PersonalPege";
import InfoPersonalPege from "./pages/User/InfoPersonalPege";

const router = createBrowserRouter([
    {
        path: "/",
        element: <InicioWrapper />,
    },
    {
        path: "/search",
        element: <Buquedapage />,
    },
    {
        path: "/login",
        element: <LoginPege />,
    },
    {
        path: "/register",
        element: <RegistroPage />
    },
    {
        path: "/Catalogo",
        element: <CatalogoPage />
    },
    {
        path: "/inicio",
        element: <Inicio />
    },
    {
        path: "/personal",
        element: <PersonalPege />
    },
    {
        path: "/Informacion-Personal",
        element: <InfoPersonalPege />
    }
]);

export default router;
