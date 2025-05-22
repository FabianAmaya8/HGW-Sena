document.addEventListener("DOMContentLoaded", function () {
    const btnIngresar = document.querySelector('#btn-ingresar');

    btnIngresar.addEventListener('click', async function (event) {
        event.preventDefault();

        const usuario = document.getElementById('usuario')?.value.trim();
        const contrasena = document.getElementById('contrasena')?.value.trim();

        // 🧪 Validaciones front-end
        if (!usuario || !contrasena) {
            Swal.fire({
                icon: "warning",
                title: 'Campos Vacíos',
                text: 'Por favor, completa todos los campos antes de continuar',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        const usuarioRegex = /^[a-zA-Z0-9_.-]+$/; // sin espacios ni caracteres raros
        if (!usuarioRegex.test(usuario)) {
            Swal.fire({
                icon: "warning",
                title: 'Usuario no válido',
                text: 'El usuario solo puede contener letras, números, guiones, puntos y guiones bajos.',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        // 🔒 Desactivar botón mientras se hace la petición
        btnIngresar.disabled = true;
        btnIngresar.textContent = 'Verificando...';

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

            if (response.ok) {
                if (result.success) {
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
                        text: result.message || "El usuario o la contraseña son incorrectos.",
                        confirmButtonText: "Reintentar"
                    });
                }
            } else {
                throw new Error("Error del servidor");
            }

        } catch (error) {
            console.error("Error en el login:", error);
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo conectar con el servidor. Intenta más tarde.",
                confirmButtonText: "Aceptar"
            });
        } finally {
            // 🔓 Reactivar botón
            btnIngresar.disabled = false;
            btnIngresar.textContent = 'Iniciar Sesión';
        }
    });
});
