import { createContext, useContext, useEffect, useState } from "react";
import { urlDB } from "../../urlDB";

const HeaderContext = createContext();

export function HeaderProvider({ user, children }) {
    const [cartCount, setCartCount] = useState(0);
    const [profileUrl, setProfileUrl] = useState(null);
    const [username, setUsername] = useState(null);
    const [loaded, setLoaded] = useState(false);

    // ---------------------------------------
    // 1. Cargar una sola vez (cache en sessionStorage)
    // ---------------------------------------
    useEffect(() => {
        if (!user) return;

        const cache = sessionStorage.getItem("headerData");
        if (cache) {
            const parsed = JSON.parse(cache);
            setCartCount(parsed.cartCount);
            setProfileUrl(parsed.profileUrl);
            setUsername(parsed.username);
            setLoaded(true);
        }

        refreshHeader(); // sincroniza con backend
    }, [user]);

    // ---------------------------------------
    // 2. Función para sincronizar con backend
    // ---------------------------------------
    async function refreshHeader() {
        if (!user) return;

        try {
            const endpoint = `/api/header?id=${user.id}`;
            const urlFetch = await urlDB(endpoint);
            const res = await fetch(urlFetch);
            const data = await res.json();

            if (data.success) {
                const { total_carrito, url_foto_perfil, usuario } = data.user;

                const count = total_carrito ?? 0;
                const img = url_foto_perfil ?? null;
                const name = usuario ?? null;

                setCartCount(count);
                setProfileUrl(img);
                setUsername(name);

                sessionStorage.setItem(
                    "headerData",
                    JSON.stringify({
                        cartCount: count,
                        profileUrl: img,
                        username: name
                    })
                );
            }
        } catch (err) {
            console.error("Error header:", err);
        }

        setLoaded(true);
    }

    return (
        <HeaderContext.Provider
            value={{
                cartCount,
                profileUrl,
                username,
                refreshHeader,
                loaded
            }}
        >
            {children}
        </HeaderContext.Provider>
    );
}

export function useHeader() {
    return useContext(HeaderContext);
}
