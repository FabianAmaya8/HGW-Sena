import { createContext, useState, useEffect } from "react";
import { useContext } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const carritoInicial = JSON.parse(localStorage.getItem("carrito")) || [];
    const [carrito, setCarrito] = useState(carritoInicial);

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    const agregarProducto = (producto, cantidad = 1) => {
        setCarrito(prev => {
            const existe = prev.find(p => p.id_producto === producto.id_producto);
            if (existe) {
                return prev.map(p =>
                    p.id_producto === producto.id_producto
                        ? { ...p, cantidad: p.cantidad + cantidad }
                        : p
                );
            } else {
                return [...prev, { ...producto, cantidad }];
            }
        });
    };

    const aumentarCantidad = (id_producto) => {
        setCarrito(prev =>
            prev.map(p =>
                p.id_producto === id_producto
                    ? { ...p, cantidad: p.cantidad + 1 }
                    : p
            )
        );
    };

    const disminuirCantidad = (id_producto) => {
        setCarrito(prev =>
            prev
                .map(p =>
                    p.id_producto === id_producto
                        ? { ...p, cantidad: p.cantidad - 1 }
                        : p
                )
                .filter(p => p.cantidad > 0)
        );
    };

    const quitarDelCarrito = (id_producto) => {
        setCarrito(prev => prev.filter(p => p.id_producto !== id_producto));
    };

    return (
        <CartContext.Provider value={{
            carrito,
            agregarProducto,
            aumentarCantidad,
            disminuirCantidad,
            quitarDelCarrito
        }}>
            {children}
        </CartContext.Provider>
        
    );
    
}
export function useCart() {
    return useContext(CartContext);
}