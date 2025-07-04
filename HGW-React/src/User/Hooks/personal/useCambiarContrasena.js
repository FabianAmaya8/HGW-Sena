import { useState } from 'react';
import { urlDB } from '../../../urlDB';

export default function useCambiarContrasena(id_usuario) {
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const cambiarContrasena = async ({ actual, nueva }) => {
        setLoading(true);
        setFeedback(null);
        try {
            const endpoint = await urlDB('api/cambiar-contrasena');
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_usuario, actual, nueva })
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || 'Error al cambiar la contraseña');
            setFeedback({ type: 'success', msg: 'Contraseña cambiada correctamente.' });
            return data;
        } catch (err) {
            setFeedback({ type: 'danger', msg: err.message });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { cambiarContrasena, loading, feedback, setFeedback };
}
