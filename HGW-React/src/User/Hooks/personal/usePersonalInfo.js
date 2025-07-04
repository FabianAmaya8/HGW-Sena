import { useState, useEffect, useCallback } from 'react';
import { urlDB } from '../../../urlDB';
import usePersonal from './usePersonal';

export default function usePersonalInfo() {
    const { personal, loading, error, refetch } = usePersonal();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState(() => ({
        nombre: '',
        apellido: '',
        nombre_usuario: '',
        correo_electronico: '',
        numero_telefono: '',
        patrocinador: '',
        pais: '',
        ciudad: '',
        direccion: '',
        codigo_postal: '',
        lugar_entrega: ''
    }));

    // Helper para extraer datos del usuario y dirección
    const getInitialFormData = useCallback(() => {
        if (!personal) return {
        nombre: '',
        apellido: '',
        nombre_usuario: '',
        correo_electronico: '',
        numero_telefono: '',
        patrocinador: '',
        pais: '',
        ciudad: '',
        direccion: '',
        codigo_postal: '',
        lugar_entrega: ''
        };
        const address = personal.direcciones?.[0] || {};
        return {
        nombre: personal.nombre || '',
        apellido: personal.apellido || '',
        nombre_usuario: personal.nombre_usuario || '',
        correo_electronico: personal.correo_electronico || '',
        numero_telefono: personal.numero_telefono || '',
        patrocinador: personal.patrocinador || '',
        pais: address.pais_id || '',        // ID del país
        ciudad: address.ciudad_id || '',    // ID de la ciudad
        direccion: address.direccion || '',
        codigo_postal: address.codigo_postal || '',
        lugar_entrega: address.lugar_entrega || ''
        };
    }, [personal]);

    // Solo inicializar cuando cambie 'personal'
    useEffect(() => {
        setFormData(getInitialFormData());
    }, [personal, getInitialFormData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = () => setEditing(true);
    const handleCancel = () => {
        setFormData(getInitialFormData());
        setEditing(false);
    };

    const handleSubmit = async (userId) => {
        try {
            // Si hay foto de perfil, usar FormData
            let body;
            let headers = {};
            const { pais, ciudad, direccion, codigo_postal, lugar_entrega, foto_perfil, ...usuarioData } = formData;
            const payload = {
                ...usuarioData,
                direcciones: [{
                    direccion,
                    codigo_postal,
                    lugar_entrega,
                    id_ubicacion: ciudad,
                    id_direccion: personal?.direcciones?.[0]?.id_direccion
                }]
            };
            if (foto_perfil) {
                body = new FormData();
                body.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
                body.append('foto_perfil', foto_perfil);
                // No se debe poner Content-Type, el navegador lo gestiona
            } else {
                body = JSON.stringify(payload);
                headers['Content-Type'] = 'application/json';
            }
            const endpoint = `api/personal/update?id=${userId}`;
            const urlFetch = await urlDB(endpoint);
            const res = await fetch(urlFetch, {
                method: 'PUT',
                headers,
                body
            });
            const data = await res.json();
            if (data.success) {
                refetch();
                setEditing(false);
            } else {
                throw new Error(data.message || 'Error al guardar la información');
            }
            return data;
        } catch (err) {
            throw err;
        }
    };

    return {
        personal,
        loading,
        error,
        editing,
        formData,
        setFormData,
        handleChange,
        handleEdit,
        handleCancel,
        handleSubmit
    };
}
