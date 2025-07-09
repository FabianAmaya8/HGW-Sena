import { useState } from "react";
import { urlDB } from "../../urlDB";

export function useCarrito() {
    const [carrito, setCarrito] = useState([]);
    const [direccion, setDireccion] = useState([]);
    const [mediosPago, setMediosPago] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const rawUser = localStorage.getItem("user");
    const usuario = rawUser ? JSON.parse(rawUser) : null;
    const id_usuario = usuario?.id;

    async function agregarProductoAlCarrito(producto, cantidad = 1) {
        if (!id_usuario) return { exito: false, mensaje: "Usuario no autenticado" };

        try {
            const url = await urlDB("api/carrito/agregar");
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_usuario,
                    id_producto: producto.id_producto,
                    cantidad,
                }),
            });
            if (!res.ok) throw new Error("Error al agregar producto");

            await obtenerCarritoDesdeAPI(); // recargar para asegurar sincronización
            return { exito: true };
        } catch (err) {
            console.error(err);
            return { exito: false, mensaje: err.message };
        }
    }

    async function obtenerCarritoDesdeAPI() {
        if (!id_usuario) return { exito: false, mensaje: "Usuario no autenticado" };

        setCargando(true);
        setError(null);
        try {
            const url = await urlDB(`api/carrito?id=${id_usuario}`);
            const res = await fetch(url);
            const data = await res.json();
            setCargando(false);
            if (res.ok && data.success) {
                setCarrito(data.productos.map(p => ({
                    id_producto: p.id_producto,
                    nombre: p.nombre_producto,
                    precio: p.precio_producto,
                    cantidad: p.cantidad_producto,
                    imagen: p.imagen_producto,
                    stock: p.stock,
                })));
                return { exito: true };
            }
            return { exito: false, mensaje: data.error || data.mensaje };
        } catch (err) {
            setCargando(false);
            setError(err);
            return { exito: false, mensaje: err.message };
        }
    }

    async function actualizarCantidad(id_producto, nueva_cantidad) {
        if (!id_usuario) return;
        if (nueva_cantidad <= 0) return quitarDelCarrito(id_producto);

        try {
            const url = await urlDB("api/carrito/actualizar");
            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_usuario, id_producto, nueva_cantidad }),
            });
            if (!res.ok) throw new Error("Error al actualizar cantidad");

            setCarrito(prev =>
                prev.map(p =>
                    p.id_producto === id_producto ? { ...p, cantidad: nueva_cantidad } : p
                )
            );
        } catch (err) {
            console.error("Error actualizando cantidad:", err);
        }
    }

    async function aumentarCantidad(id_producto) {
        const producto = carrito.find(p => p.id_producto === id_producto);
        if (producto) {
            await actualizarCantidad(id_producto, producto.cantidad + 1);
        }
    }

    async function disminuirCantidad(id_producto) {
        const producto = carrito.find(p => p.id_producto === id_producto);
        if (producto && producto.cantidad > 1) {
            await actualizarCantidad(id_producto, producto.cantidad - 1);
        } else {
            await quitarDelCarrito(id_producto);
        }
    }

    async function quitarDelCarrito(id_producto) {
        if (!id_usuario) return;

        try {
            const url = await urlDB("api/carrito/eliminar");
            const res = await fetch(url, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_usuario, id_producto }),
            });
            if (!res.ok) throw new Error("Error al eliminar producto");

            setCarrito(prev => prev.filter(p => p.id_producto !== id_producto));
        } catch (err) {
            console.error("Error quitando producto:", err);
        }
    }

    async function obtenerDirecciones() {
        if (!id_usuario) return;

        try {
            const url = await urlDB(`api/direcciones?id=${id_usuario}`);
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok && data.success) {
                setDireccion(data.direcciones);
            } else {
                console.error("Error al obtener direcciones:", data.error || data.mensaje);
            }
        } catch (err) {
            console.error("Error al obtener direcciones:", err);
        }
    }

    async function obtenerMediosPago() {
        try {
            const url = await urlDB("api/medios-pago");
            const res = await fetch(url);
            if (!res.ok) throw new Error("Error al cargar métodos de pago");
            const data = await res.json();
            setMediosPago(data);
        } catch (err) {
            console.error(err);
        }
    }

    function clearCart() {
        setCarrito([]);
    }

    return {
        carrito,
        direccion,
        mediosPago,
        cargando,
        error,
        agregarProductoAlCarrito,
        obtenerCarritoDesdeAPI,
        obtenerDirecciones,
        obtenerMediosPago,
        aumentarCantidad,
        disminuirCantidad,
        quitarDelCarrito,
        clearCart
    };
}
