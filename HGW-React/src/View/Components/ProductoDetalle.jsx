import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { mostrarAlerta } from '../hooks/alerta-añadir';
import { CartContext } from "../../pages/Context/CartContext";
import { urlDB } from "../../urlDB";
import "../../assets/css/ProductoDetalle.css";

export default function ProductoDetalle() {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [imagenActual, setImagenActual] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const baseURL = "http://localhost:3000/";

    const { agregarProducto } = useContext(CartContext);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const url = await urlDB(`api/producto/${id}`);
                const res = await fetch(url);
                if (!res.ok) throw new Error("Producto no encontrado");
                const data = await res.json();
                setProducto(data);
                setImagenActual(data.imagen);
            } catch (error) {
                console.error("Error al cargar producto:", error);
                setProducto(null);
            }
        };
        fetchProducto();
    }, [id]);

    if (!producto) {
        return (
            <main className="product-container">
                <h2 className="product-title"></h2>
            </main>
        );
    }

    const aumentarCantidad = () => setCantidad(c => c + 1);
    const disminuirCantidad = () => setCantidad(c => (c > 1 ? c - 1 : 1));

    const stockDisponible = producto.stock ?? 0;
    let estadoStock = "";
    let claseStock = "";

    if (stockDisponible > 10) {
        estadoStock = "En stock";
        claseStock = "stock-ok";
    } else if (stockDisponible > 0) {
        estadoStock = "¡Quedan pocas unidades!";
        claseStock = "stock-low";
    } else {
        estadoStock = "No disponible";
        claseStock = "stock-out";
    }

    const handleAgregar = async () => {
        try {
            const rawUser = localStorage.getItem("user");
            const usuario = rawUser ? JSON.parse(rawUser) : null;
            const id_usuario = usuario?.id;


            if (!id_usuario) {
                console.warn("⚠️ Usuario no encontrado en localStorage");
                return;
            }

            await fetch("http://localhost:3000/api/carrito/agregar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_usuario: id_usuario,   
                    id_producto: producto.id_producto,
                    cantidad: cantidad
                })
            });


            agregarProducto({
                id_producto: producto.id_producto,
                nombre: producto.nombre,
                precio: producto.precio
            }, cantidad);

            mostrarAlerta(producto.nombre, () => {
                setTimeout(() => {
                    window.location.href = "/carrito";
                }, 100);
            });

        } catch (error) {
            console.error("❌ Error al guardar el producto en la base:", error);
        }
    };

    console.log(localStorage.getItem("usuario"));

    return (
        <main className="product-container">
            <div className="product-card">
                <div className="product-left">
                    <div className="main-image">
                        <img src={`${baseURL}${imagenActual}`} alt={`Imagen de ${producto.nombre}`} />
                    </div>
                    <div className="thumbnails">
                        {[producto.imagen, ...(Array.isArray(producto.imagenes) ? producto.imagenes : [])].map((img, i) => (
                            <img
                                key={i}
                                src={`${baseURL}${img}`}
                                alt={`Miniatura ${i + 1}`}
                                onClick={() => setImagenActual(img)}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-right">
                    <h2 className="product-title">
                        {producto.nombre}
                        <span className={`availability-badge ${claseStock}`}>{estadoStock}</span>
                    </h2>

                    <div className="price-row">
                        <span className="price">${producto.precio?.toLocaleString("es-CO")}</span>
                    </div>

                    <p><strong>Descripción:</strong> {producto.descripcion || "Sin descripción disponible"}</p>

                    <div className="quantity-actions">
                        <button onClick={disminuirCantidad}>−</button>
                        <input type="text" value={cantidad} readOnly />
                        <button onClick={aumentarCantidad}>+</button>
                    </div>

                    <div className="cta-buttons">
                        <button
                            className="btn add-cart"
                            disabled={stockDisponible <= 0}
                            onClick={handleAgregar}
                        >
                            Añadir al Carrito
                        </button>
                        <button className="btn buy-now" disabled={stockDisponible <= 0}>
                            Comprar Ahora
                        </button>
                    </div>

                    <div className="extra-info">
                        <p><strong>Categoría:</strong> {producto.categoria}</p>
                        <p><strong>Etiquetas:</strong> {producto.etiquetas?.join(", ") || "Sin etiquetas"}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
