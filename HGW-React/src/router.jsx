import { createBrowserRouter } from "react-router-dom";
// Visitante
import InicioWrapper from "./pages/View/inicioWrapper";
import Buquedapage from "./pages/User/buqueda";
import LoginPege from "./pages/View/loginPage";
import RegistroPage from "./pages/View/registroPage";
import CatalogoPage from "./pages/View/catalogoPege";
// Usuario
import Inicio from "./pages/User/InicioPege";

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
    }
]);

export default router;
