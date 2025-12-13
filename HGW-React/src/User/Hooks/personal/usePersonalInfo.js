import { useState, useEffect, useCallback } from 'react';
import { urlDB } from '../../../urlDB';
import usePersonal from './usePersonal';
import Swal from 'sweetalert2';

export default function usePersonalInfo() {
    const { personal, loading, error, refetch } = usePersonal();
    const [editing, setEditing] = useState(false);
    const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
    const [loadingCrearDireccion, setLoadingCrearDireccion] = useState(false);

    // ============================================
    // ESTADOS SEPARADOS
    // ============================================

    const emptyUsuario = {
        nombre: '',
        apellido: '',
        nombre_usuario: '',
        correo_electronico: '',
        numero_telefono: '',
        patrocinador: ''
    };

    const emptyDireccion = {
        pais: '',
        ciudad: '',
        direccion: '',
        codigo_postal: '',
        lugar_entrega: ''
    };

    const [formUsuario, setFormUsuario] = useState(emptyUsuario);
    const [formDireccion, setFormDireccion] = useState(emptyDireccion);

    const seleccionarDireccion = (dir) => {
        setDireccionSeleccionada(dir);
        setFormDireccion({
            pais: String(dir.pais_id),
            ciudad: String(dir.ciudad_id),
            direccion: dir.direccion,
            codigo_postal: dir.codigo_postal,
            lugar_entrega: dir.lugar_entrega
        });
        setEditing(true);
    };

    const alertNoti = (msg) => {
        Swal.fire({
            title: '¡Actualización exitosa!',
            text: msg,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
        refetch();
    };

    // ============================================
    // MAPEO DE DATOS DEL BACKEND → FORMULARIOS
    // ============================================

    const mapPersonalToUsuario = useCallback(() => {
        if (!personal) return emptyUsuario;
        return {
            nombre: personal.nombre || '',
            apellido: personal.apellido || '',
            nombre_usuario: personal.nombre_usuario || '',
            correo_electronico: personal.correo_electronico || '',
            numero_telefono: personal.numero_telefono || ''
        };
    }, [personal]);


    const mapPersonalToDireccion = useCallback(() => {
        if (!personal) return emptyDireccion;
        const dir = personal.direcciones?.[0] || {};
        return {
            pais: dir.pais_id ? String(dir.pais_id) : '',
            ciudad: dir.ciudad_id ? String(dir.ciudad_id) : '',
            direccion: dir.direccion || '',
            codigo_postal: dir.codigo_postal || '',
            lugar_entrega: dir.lugar_entrega || ''
        };
    }, [personal]);

    // ============================================
    // CREAR UNA DIRECCIÓN NUEVA
    // ============================================

    const crearDireccion = async (nuevaDireccion) => {
        try {
            setLoadingCrearDireccion(true);

            const endpoint = await urlDB(`api/direcciones/crear`);

            const payload = {
                ...nuevaDireccion,
                id_usuario: personal?.id_usuario,
                id_ubicacion: parseInt(nuevaDireccion.ciudad)
            };

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message);

            alertNoti("La nueva dirección ha sido creada correctamente.");

            return data;
        } catch (error) {
            console.error("Error creando dirección:", error);
            throw error;
        } finally {
            setLoadingCrearDireccion(false);
        }
    };

    // ============================================
    // CARGAR DATOS CUANDO CAMBIA "personal"
    // ============================================

    useEffect(() => {
        if (personal) {
            setFormUsuario(mapPersonalToUsuario());
            setFormDireccion(mapPersonalToDireccion());
        }
    }, [personal, mapPersonalToUsuario, mapPersonalToDireccion]);



    // ============================================
    // HANDLERS DE CAMBIO
    // ============================================

    const handleChangeUsuario = (e) => {
        const { name, value } = e.target;
        setFormUsuario(prev => ({ ...prev, [name]: value }));
    };

    const handleChangeDireccion = (e) => {
        const { name, value } = e.target;
        setFormDireccion(prev => ({ ...prev, [name]: value }));
    };



    // ============================================
    // CANCELAR EDICIÓN
    // ============================================

    const handleCancel = () => {
        setFormUsuario(mapPersonalToUsuario());
        setFormDireccion(mapPersonalToDireccion());
        setEditing(false);
    };



    // ============================================
    // GUARDAR DATOS PERSONALES
    // ============================================

    const updateUsuario = async (userId) => {
        const payload = { ...formUsuario };

        const endpoint = await urlDB(`api/personal/update?id=${userId}`);

        const res = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        alertNoti("Los datos personales han sido actualizados correctamente.");

        return data;
    };

    // ============================================
    // GUARDAR DIRECCIÓN
    // ============================================

    const updateDireccion = async (userId) => {
        const payload = {
            direcciones: [
                {
                    id_direccion: personal?.direcciones?.[0]?.id_direccion || null,
                    id_ubicacion: parseInt(formDireccion.ciudad),  // <--- AQUÍ!
                    direccion: formDireccion.direccion,
                    codigo_postal: formDireccion.codigo_postal,
                    lugar_entrega: formDireccion.lugar_entrega
                }
            ]
        };

        const endpoint = await urlDB(`api/personal/update?id=${userId}`);
        const res = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        alertNoti("La dirección ha sido actualizada correctamente.");

        return data;
    };

    const refetchN = () => {
        refetch();
    }

    return {
        personal,
        loading,
        error,
        editing,
        formUsuario,
        formDireccion,
        direccionSeleccionada,
        setDireccionSeleccionada,
        seleccionarDireccion,
        handleChangeUsuario,
        handleChangeDireccion,
        handleEdit: () => setEditing(true),
        handleCancel,
        updateUsuario,
        updateDireccion,
        crearDireccion,
        loadingCrearDireccion,
        refetch: refetchN
    };
}
