import { useState, useEffect } from "react";
import { findWorkingBaseUrl } from "../../../urlDB";

export function useEducacion(idTema = null) {
    const [temas, setTemas] = useState([]);
    const [contenidos, setContenidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);

            try {
                const base = await findWorkingBaseUrl();
                const cleanBase = base.replace(/\/$/, "");

                // -------- Fetch Temas --------
                let urlTemas = `${cleanBase}/api/educacion`;
                if (idTema) {
                    urlTemas = `${cleanBase}/api/educacion/${idTema}`;
                }

                const resTemas = await fetch(urlTemas);
                if (!resTemas.ok) {
                    throw new Error(`Error al consultar /api/educacion: ${resTemas.status}`);
                }
                const dataTemas = await resTemas.json();
                setTemas(Array.isArray(dataTemas) ? dataTemas : [dataTemas]);

                // -------- Fetch Contenidos --------
                let urlContenidos = `${cleanBase}/api/contenido_tema`;
                if (idTema) {
                    urlContenidos = `${cleanBase}/api/contenido_tema/tema/${idTema}`;
                }

                const resContenidos = await fetch(urlContenidos);
                if (!resContenidos.ok) {
                    throw new Error(`Error al consultar /api/contenido_tema: ${resContenidos.status}`);
                }
                const dataContenidos = await resContenidos.json();
                setContenidos(Array.isArray(dataContenidos) ? dataContenidos : [dataContenidos]);

            } catch (e) {
                console.error("Error en useEducacion:", e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [idTema]);

    return { temas, contenidos, loading, error };
}