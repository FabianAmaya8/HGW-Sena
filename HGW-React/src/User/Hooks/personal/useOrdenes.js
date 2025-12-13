import { useState } from "react";
import Swal from "sweetalert2";
import { urlDB } from "../../../urlDB";
import { useAuth } from "../../../pages/Context/AuthContext";

export default function useOrdenes() {

    const { user } = useAuth();
    const id_usuario = user?.id;

    const [ordenes, setOrdenes] = useState([]);
    const [detalle, setDetalle] = useState(null);

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    // =====================================================
    // Obtener TODAS las órdenes del usuario
    // =====================================================
    async function obtenerOrdenes() {
        if (!id_usuario) {
            setError("Usuario no autenticado");
            return;
        }

        setCargando(true);
        setError(null);

        try {
            const url = await urlDB(`api/ordenes-usuario?id=${id_usuario}`);
            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok || !data.success) {
                setOrdenes([]);
                return;
            }

            setOrdenes(data.ordenes);
        } catch (err) {
            console.error("Error obteniendo órdenes:", err);
            setError(err.message);
            Swal.fire("Error", "No se pudieron cargar las órdenes.", "error");
        } finally {
            setCargando(false);
        }
    }

    // =====================================================
    // Obtener DETALLE de una orden por ID
    // =====================================================
    async function obtenerDetalleOrden(id_orden) {
        setCargando(true);
        setError(null);

        try {
            const url = await urlDB(`ordenDetalle/${id_orden}`);
            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok || data.error) {
                Swal.fire("Error", data.error || "No se pudo cargar el detalle", "error");
                return;
            }

            setDetalle(data);
        } catch (err) {
            console.error("Error al obtener detalle:", err);
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    function limpiarDetalle() {
        setDetalle(null);
    }

    return {
        ordenes,
        detalle,
        cargando,
        error,
        obtenerOrdenes,
        obtenerDetalleOrden,
        limpiarDetalle
    };
}
