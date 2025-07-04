import { useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useState, useEffect } from "react";
import "../../assets/css/ProductoDetalle.css";

export default function ProductoDetalle() {
    const { id } = useParams();
    const productos = useProducts();
    const producto = productos.find(p => p.id_producto === parseInt(id));
    const [imagenActual, setImagenActual] = useState("");
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        if (producto?.imagen) {
            setImagenActual(producto.imagen);
        }
    }, [producto]);

    if (!producto) {
        return <main className="product-container"><h2>Producto no encontrado 😢</h2></main>;
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

    return (
        <main className="product-container">
            <div className="product-card">
                <div className="product-left">
                    <div className="main-image">
                        <img src={imagenActual} alt={`Imagen de ${producto.nombre}`} />
                    </div>
                    <div className="thumbnails">
                        {(producto.imagenes || [producto.imagen]).map((img, i) => (
                            <img key={i} src={img} alt={`Miniatura ${i + 1}`} onClick={() => setImagenActual(img)} />
                        ))}
                    </div>
                </div>

                <div className="product-right">
                    <h2 className="product-title">
                        {producto.nombre}
                        <span className={`availability-badge ${claseStock}`}>
                            {estadoStock}
                        </span>
                    </h2>

                    <div className="price-row">
                        <span className="price">${producto.precio?.toLocaleString("es-CO")}</span>
                    </div>

                    {/* Título de descripción */}
                    <p><strong>Descripcion:</strong> {producto.descripcion}</p>

                    <div className="quantity-actions">
                        <button onClick={disminuirCantidad}>−</button>
                        <input type="text" value={cantidad} readOnly />
                        <button onClick={aumentarCantidad}>+</button>
                    </div>

                    <div className="cta-buttons">
                        <button
                            className="btn add-cart"
                            disabled={stockDisponible <= 0}
                            onClick={() => alert("Añadido al carrito 🎉")}
                        >
                            Añadir al Carrito
                        </button>
                        <button
                            className="btn buy-now"
                            disabled={stockDisponible <= 0}
                        >
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


