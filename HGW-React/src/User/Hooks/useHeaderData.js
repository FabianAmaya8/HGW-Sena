import { useEffect, useState } from "react";
import { urlDB, findWorkingBaseUrl } from "../../urlDB";

export function useHeaderData(user) {
    const [cartCount, setCartCount] = useState(0);
    const [profileUrl, setProfileUrl] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchFullUserData = async () => {
            try {
                const endpoint = `/api/header?id=${user.id}`;
                const urlFetch = await urlDB(endpoint);
                const res = await fetch(urlFetch);
                const data = await res.json();

                if (data.success) {
                    setCartCount(data.user.total_carrito ?? 0);

                    const profilePath = data.user.url_foto_perfil ?? null;
                    if (profilePath) {
                        setProfileUrl(profilePath);
                    }
                } else {
                    console.warn("No se pudo cargar datos de usuario:", data.message);
                }
            } catch (error) {
                console.error("Error al cargar datos de usuario:", error);
            }
        };

        const fetchCartCountOnly = async () => {
            try {
                const endpoint = `/api/header?id=${user.id}`;
                const urlFetch = await urlDB(endpoint);
                const res = await fetch(urlFetch);
                const data = await res.json();
                    
                if (data.success) {
                    setCartCount(data.user.total_carrito ?? 0);
                }
            } catch (error) {
                console.error("Error al actualizar total del carrito:", error);
            }
        };

        fetchFullUserData();
        const intervalo = setInterval(fetchCartCountOnly, 30000);

        return () => clearInterval(intervalo);
    }, [user]);

    return { cartCount, profileUrl };
}
