import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import { urlDB } from '../../urlDB';

export default function useLoginForm() {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleSubmit = useCallback(
        async (event) => {
        event.preventDefault();

        // Validar campos no vacíos
        if (!usuario || !contrasena) {
            Swal.fire({
            icon: 'warning',
            title: 'Campos Vacíos',
            text: 'Por favor, completa todos los campos antes de continuar',
            confirmButtonText: 'Aceptar',
            });
            return;
        }

        setLoading(true);
        try {
            const endpoint = 'api/login';
            const urlFetch = await urlDB(endpoint);

            const response = await fetch(urlFetch, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ usuario, contrasena }),
            });

            const result = await response.json();

            // respuesta
            if (response.ok && result.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Inicio exitoso',
                text: result.message || 'Bienvenido',
                confirmButtonText: 'Ingresar',
            });
            
            // Redirigir según la propiedad `redirect` que envía el backend
            window.location.href = result.redirect || '/';
            } else {
            // Si no es OK o result.success === false
            Swal.fire({
                icon: 'error',
                title: 'Credenciales no válidas',
                text: result.message || 'Usuario o contraseña incorrectos.',
                confirmButtonText: 'Reintentar',
            });
            }
        } catch (error) {
            console.error('Error en login:', error);
            Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor.',
            confirmButtonText: 'Aceptar',
            });
        } finally {
            setLoading(false);
        }
        },
        [usuario, contrasena]
    );

    return {
        usuario,
        setUsuario,
        contrasena,
        setContrasena,
        showPassword,
        togglePassword,
        handleSubmit,
        loading,
    };
}
