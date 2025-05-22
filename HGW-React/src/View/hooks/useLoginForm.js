// src/hooks/useLoginForm.js
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function useLoginForm() {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePassword = () => setShowPassword(prev => !prev);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!usuario || !contrasena) {
        Swal.fire({
            icon: "warning",
            title: 'Campos Vacíos',
            text: 'Por favor, completa todos los campos antes de continuar',
            confirmButtonText: 'Aceptar',
        });
        return;
        }

        const usuarioRegex = /^[a-zA-Z0-9_.-]+$/;
        if (!usuarioRegex.test(usuario)) {
        Swal.fire({
            icon: "warning",
            title: 'Usuario no válido',
            text: 'Solo letras, números, guiones, puntos y guiones bajos.',
            confirmButtonText: 'Aceptar',
        });
        return;
        }

        setLoading(true);

        try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify({ usuario, contrasena })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            Swal.fire({
            icon: "success",
            title: "Inicio exitoso",
            text: result.message || "Bienvenido",
            confirmButtonText: "Ingresar"
            }).then(() => {
            window.location.href = result.redirect || "/";
            });
        } else {
            Swal.fire({
            icon: "error",
            title: "Credenciales no válidas",
            text: result.message || "Usuario o contraseña incorrectos.",
            confirmButtonText: "Reintentar"
            });
        }
        } catch (error) {
        console.error("Error en login:", error);
        Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor.",
            confirmButtonText: "Aceptar"
        });
        } finally {
        setLoading(false);
        }
    };

    return {
        usuario,
        setUsuario,
        contrasena,
        setContrasena,
        showPassword,
        togglePassword,
        handleSubmit,
        loading
    };
}
