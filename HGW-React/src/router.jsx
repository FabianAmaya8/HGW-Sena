import { createBrowserRouter } from "react-router-dom";
import InicioWrapper from "./pages/View/inicioWrapper";
import LoginPege from "./pages/View/loginPage";
import RegistroPage from "./pages/View/registroPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <InicioWrapper />,
    },
    {
        path: "/login",
        element: <LoginPege />,
    },
    {
        path: "/register",
        element: <RegistroPage />
    },
]);

export default router;
