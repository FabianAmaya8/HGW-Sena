import { useState, useEffect, useCallback } from 'react';
import { urlDB } from '../../../urlDB';
import usePersonal from './usePersonal';

export default function usePersonalInfo() {
    const { personal, loading, error, refetch } = usePersonal();

    const [editing, setEditing] = useState(false);

    const emptyState = {
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
        lugar_entrega: '',
        foto_perfil: null
    };

    const [formData, setFormData] = useState(emptyState);

    // Convertir datos de backend → formData
    const mapPersonalToForm = useCallback(() => {
        if (!personal) return emptyState;

        const dir = personal.direcciones?.[0] || {};

        return {
            nombre: personal.nombre || '',
            apellido: personal.apellido || '',
            nombre_usuario: personal.nombre_usuario || '',
            correo_electronico: personal.correo_electronico || '',
            numero_telefono: personal.numero_telefono || '',
            patrocinador: personal.patrocinador || '',
            pais: dir.pais_id ? String(dir.pais_id) : '',
            ciudad: dir.ciudad_id ? String(dir.ciudad_id) : '',
            direccion: dir.direccion || '',
            codigo_postal: dir.codigo_postal || '',
            lugar_entrega: dir.lugar_entrega || '',
            foto_perfil: null
        };
    }, [personal]);

    // Inicializar datos cuando cambia el personal
    useEffect(() => {
        if (personal) {
            setFormData(mapPersonalToForm());
        }
    }, [personal, mapPersonalToForm]);


    // Input genérico
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    // Cancelar → restablecer datos originales
    const handleCancel = () => {
        setFormData(mapPersonalToForm());
        setEditing(false);
    };


    // Guardar cambios
    const handleSubmit = async (userId) => {
        try {
            const {
                pais,
                ciudad,
                direccion,
                codigo_postal,
                lugar_entrega,
                foto_perfil,
                ...usuarioData
            } = formData;

            const payload = {
                ...usuarioData,
                direcciones: [
                    {
                        direccion,
                        codigo_postal,
                        lugar_entrega,
                        id_ubicacion: parseInt(ciudad),
                        id_direccion: personal?.direcciones?.[0]?.id_direccion
                    }
                ]
            };

            let body;
            let headers = {};

            if (foto_perfil) {
                body = new FormData();
                body.append(
                    'data',
                    new Blob([JSON.stringify(payload)], { type: 'application/json' })
                );
                body.append('foto_perfil', foto_perfil);
            } else {
                body = JSON.stringify(payload);
                headers['Content-Type'] = 'application/json';
            }

            const endpoint = `api/personal/update?id=${userId}`;
            const url = await urlDB(endpoint);

            const res = await fetch(url, {
                method: 'PUT',
                headers,
                body
            });

            const data = await res.json();

            if (data.success) {
                refetch();
                setEditing(false);
            } else {
                throw new Error(data.message || 'Error al guardar');
            }

            return data;

        } catch (err) {
            console.error(err);
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
        handleEdit: () => setEditing(true),
        handleCancel,
        handleSubmit
    };
}
