import { Navigate } from "react-router-dom";
import { useAuth } from "../../pages/Context/AuthContext";

export default function LogoutWrapper() {
    const { logout } = useAuth();
    logout(); // limpia token / sesión
    return <Navigate to="/" replace />;
}
