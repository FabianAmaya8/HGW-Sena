import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { mostrarAlerta } from "../hooks/alerta-añadir";
import { urlDB } from "../../urlDB";
import { useImageUrls } from "../../User/Hooks/useImgUrl";
import { useCarrito } from "../hooks/useCarrito";
import { Infinity } from "ldrs/react";
import "../../assets/css/ProductoDetalle.css";

export default function ProductoDetalle() {
    const { id } = useParams();
    const { agregarProductoAlCarrito, cargando } = useCarrito();

    const [detalle, setDetalle] = useState(null);
    const [imagenActual, setImagenActual] = useState(null);
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        async function fetchProducto() {
            try {
                const apiUrl = await urlDB(`api/producto/unico?id=${id}`);
                const res    = await fetch(apiUrl);
                if (!res.ok) throw new Error("Producto no encontrado");
                const data   = await res.json();
                setDetalle(data);
            } catch (err) {
                console.error("Error al cargar producto:", err);
                setDetalle(null);
            }
        }
        fetchProducto();
    }, [id]);

    const imgs       = useMemo(() => detalle
        ? [detalle.imagen, ...(detalle.imagenes || [])]
        : []
    , [detalle]);
    const urlsImgs   = useImageUrls(imgs);
    const mainImgUrl = urlsImgs[0];

    useEffect(() => {
        if (mainImgUrl) setImagenActual(mainImgUrl);
    }, [mainImgUrl]);

    if (cargando || !detalle) {
        return (
            <div className="cargando">
                <Infinity
                    size="150"
                    stroke="10"
                    strokeLength="0.15"
                    bgOpacity="0.3"
                    speed="1.3"
                    color="#47BF26"
                />
            </div>
        );
    }

    const {
        nombre,
        precio,
        descripcion = "Sin descripción disponible",
        stock = 0,
        categoria,
        subcategoria,
        etiquetas = []
    } = detalle;

    let estadoStock = "", claseStock = "";
    if (stock > 10) {
        estadoStock = "En stock"; claseStock = "stock-ok";
    } else if (stock > 0) {
        estadoStock = "¡Quedan pocas unidades!"; claseStock = "stock-low";
    } else {
        estadoStock = "No disponible"; claseStock = "stock-out";
    }

    const incrementar = () => {
        if (cantidad < stock) setCantidad(c => c + 1);
    };
    const decrementar = () => {
        if (cantidad > 1) setCantidad(c => c - 1);
    };

    const onAgregar = async () => {
        const res = await agregarProductoAlCarrito(detalle, cantidad);
        if (res.exito) {
            mostrarAlerta(
                `${nombre} x${cantidad} agregado`,
                () => setTimeout(() => window.location.href = "/carrito", 100)
            );
        } else {
            console.error("Error al agregar:", res.mensaje);
        }
    };

    return (
        <>
        <div className="volver">
                <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
                    <i className='bx bx-left-arrow-alt'></i> Volver
                </button>
            </div>
        
        <main className="product-container">
            <div className="product-card">
                <div className="product-left">
                    <div className="main-image">
                        <img
                            src={imagenActual}
                            alt={`Imagen de ${nombre}`}
                        />
                    </div>
                    <div className="thumbnails">
                        {urlsImgs.map((url, idx) => (
                            <img
                                key={idx}
                                src={url}
                                alt={`Miniatura ${idx + 1}`}
                                onClick={() => setImagenActual(url)}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-right">
                    <h2 className="product-title">
                        {nombre}
                        <span className={`availability-badge ${claseStock}`}>
                            {estadoStock}
                        </span>
                    </h2>

                    <div className="price-row">
                        <span className="price">
                            ${precio.toLocaleString("es-CO")}
                        </span>
                    </div>

                    <p>
                        <strong>Descripción:</strong> {descripcion}
                    </p>

                    <div className="quantity-actions">
                        <button
                            onClick={decrementar}
                            disabled={cantidad <= 1}
                        >−</button>
                        <input
                            type="text"
                            value={cantidad}
                            readOnly
                        />
                        <button
                            onClick={incrementar}
                            disabled={cantidad >= stock}
                        >+</button>
                    </div>

                    <div className="cta-buttons">
                        <button
                            className="btn add-cart"
                            disabled={stock <= 0}
                            onClick={onAgregar}
                        >
                            Añadir {cantidad} al Carrito
                        </button>
                        <button
                            className="btn buy-now"
                            disabled={stock <= 0}
                        >
                            Comprar Ahora
                        </button>
                    </div>

                    <div className="extra-info">
                        <p><strong>Categoría:</strong> {categoria}</p>
                        <p><strong>Subcategoría:</strong> {subcategoria}</p>
                    </div>
                </div>
            </div>
        </main>
        </>
    );
}
