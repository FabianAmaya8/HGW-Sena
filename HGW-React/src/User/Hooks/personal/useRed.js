import { useState } from "react";
import Swal from "sweetalert2";
import { urlDB } from "../../../urlDB";
import { useAuth } from "../../../pages/Context/AuthContext";

export default function useRed() {

    const { user } = useAuth();
    const id_usuario = user?.id;

    const [red, setRed] = useState([]);
    const [codigoPatrocinador, setCodigoPatrocinador] = useState("");
    const [total, setTotal] = useState(0);

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    // =====================================================
    // Obtener la red del usuario
    // =====================================================
    async function obtenerRed() {
        if (!id_usuario) {
            setError("Usuario no autenticado");
            return;
        }

        setCargando(true);
        setError(null);

        try {
            const url = await urlDB(`api/mi-red?id=${id_usuario}`);
            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok || !data.success) {
                setRed([]);
                Swal.fire("Error", data.message || "Error al cargar la red.", "error");
                return;
            }

            setCodigoPatrocinador(data.codigo_patrocinador);
            setTotal(data.total);
            setRed(data.red);

        } catch (err) {
            console.error("Error obteniendo red:", err);
            setError(err.message);
            Swal.fire("Error", "No se pudo cargar la red.", "error");
        } finally {
            setCargando(false);
        }
    }

    return {
        red,
        codigoPatrocinador,
        total,
        cargando,
        error,
        obtenerRed
    };
}
