// src/hooks/carritoUtils.js
export async function handleAgregarProducto({ producto, cantidad }) {
    const rawUser = localStorage.getItem("user");
    const usuario = rawUser ? JSON.parse(rawUser) : null;
    const id_usuario = usuario?.id;

    if (!id_usuario) return { exito: false };

    try {
        await fetch("http://localhost:3000/api/carrito/agregar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_usuario,
                id_producto: producto.id_producto,
                cantidad
            })
        });

        return { exito: true };
    } catch (error) {
        console.error("Error al agregar producto:", error);
        return { exito: false };
    }
}
