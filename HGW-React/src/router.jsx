import { createBrowserRouter } from "react-router-dom";

// Visitante
import InicioWrapper from "./pages/View/inicioWrapper";
import Buquedapage from "./pages/User/buqueda";
import LoginPege from "./pages/View/loginPage";
import RegistroPage from "./pages/View/registroPage";
import CatalogoPage from "./pages/View/catalogoPege";
import Carritopage from "./pages/User/carritopag";


// Usuario
import Inicio from "./pages/User/InicioPege";
import PersonalPage from "./pages/User/personalPage";
import EducacionPage from "./pages/User/educacionPage";
import ProductoPag from "./pages/User/productopag";



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
        element: <RegistroPage />,
    },
    {
        path: "/Catalogo",
        element: <CatalogoPage />,
    },
    {
        path: "/inicio",
        element: <Inicio />,
    },
    {
        path: "/Personal",
        element: <PersonalPage />,
    },
    {
        path: "/Educacion",
        element: <EducacionPage />,
    },
    {
        path: "/producto/:id",
        element: <ProductoPag />
    },
    {
        path: "/carrito",
        element: <Carritopage />,
    }



]);

export default router;
