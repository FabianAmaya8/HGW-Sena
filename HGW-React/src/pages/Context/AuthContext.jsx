import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const isTokenValid = () => {
        if (!token) return false;
        try {
            const { exp } = jwtDecode(token);
            const now = Date.now();
            const expMs = exp * 1000;

            return now < expMs;
        } catch (err) {
            console.error("Token inválido:", err);
            localStorage.removeItem("token");
            return false;
        }
    };


    const isAuthenticated = isTokenValid();
    const user = isAuthenticated ? jwtDecode(token) : null;

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    useEffect(() => {
        if (!token) return;
        const intervalo = setInterval(() => {
            const valido = isTokenValid();
            if (!valido) {
                Swal.fire({
                    title: "Sesion expirada",
                    text: "Su sesion ha expirado. Por favor, vuelva a iniciar sesion.",
                    icon: "warning",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#03624c"
                })
                logout();
            }
        }, 60000);

        return () => clearInterval(intervalo);
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
