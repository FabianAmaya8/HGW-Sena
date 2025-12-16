import { useState } from "react";
import Swal from "sweetalert2";
import { urlDB } from "../../../urlDB";

export default function useDirecciones(id_usuario) {

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    // ============================================================
    // CREAR DIRECCIÓN
    // ============================================================
    async function crearDireccion({ pais, ciudad, direccion, codigo_postal, lugar_entrega }) {
        setLoading(true);
        setFeedback(null);

        try {
            const endpoint = await urlDB("api/direcciones/crear");

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_usuario,
                    pais,
                    ciudad,
                    direccion,
                    codigo_postal,
                    lugar_entrega
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Error al crear dirección");
            }

            setFeedback({ type: "success", msg: "Dirección creada correctamente." });

            return {
                success: true,
                id_direccion: data.id_direccion
            };

        } catch (err) {
            setFeedback({ type: "danger", msg: err.message });
            return { success: false };
        } finally {
            setLoading(false);
        }
    }

    // ============================================================
    // ELIMINAR DIRECCIÓN
    // ============================================================
    async function eliminarDireccion(id_direccion) {
        const confirmar = await Swal.fire({
            title: "¿Eliminar dirección?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        });

        if (!confirmar.isConfirmed) {
            return { success: false, cancelled: true };
        }

        setLoading(true);
        setFeedback(null);

        try {
            const endpoint = await urlDB("api/direcciones/eliminar");

            const res = await fetch(endpoint, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_usuario,
                    id_direccion
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Error al eliminar dirección");
            }

            setFeedback({ type: "success", msg: "Dirección eliminada correctamente." });

            return { success: true };

        } catch (err) {
            setFeedback({ type: "danger", msg: err.message });
            return { success: false };
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        feedback,
        setFeedback,
        crearDireccion,
        eliminarDireccion
    };
}
