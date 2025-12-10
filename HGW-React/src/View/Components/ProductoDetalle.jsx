import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAlertasCarrito  } from "../hooks/alerta-añadir";
import { urlDB } from "../../urlDB";
import { useImageUrls } from "../../User/Hooks/useImgUrl";
import { useCarrito } from "../hooks/useCarrito";
import { Infinity } from "ldrs/react";
import "../../assets/css/ProductoDetalle.css";

export default function ProductoDetalle() {
    const { id } = useParams();
    const { agregarProductoAlCarrito, cargando } = useCarrito();
    const { mostrarAlerta } = useAlertasCarrito();
    const navigation = useNavigate();

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
                () => setTimeout(() => navigation("/carrito"), 100)
            );
        } else {
            console.error("Error al agregar:", res.mensaje);
        }
    };

    return (
        <div className="producto-detalle container">
            <div className="volver ">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => window.history.back()}
                >
                    <i className="bx bx-left-arrow-alt" /> Volver
                </button>
            </div>

            <div className="row bg-white shadow-sm rounded p-4">
                {/* IZQUIERDA: imágenes */}
                <div className="col-md-6 ">
                    <img
                        src={imagenActual}
                        alt={`Imagen de ${nombre}`}
                        className="img-fluid rounded "
                        style={{ objectFit: "cover", aspectRatio: "1 / 1" }}
                    />
                    <div className="d-flex gap-2">
                        {urlsImgs.map((url, idx) => (
                            <img
                                key={idx}
                                src={url}
                                alt={`Miniatura ${idx + 1}`}
                                onClick={() => setImagenActual(url)}
                                className="img-thumbnail"
                                style={{ width: 70, height: 70, cursor: "pointer" }}
                            />
                        ))}
                    </div>
                </div>

                {/* DERECHA: detalles */}
                <div className="col-md-6 d-flex flex-column">
                    <div>
                        <h2 className="h3 d-flex align-items-center gap-2">
                            {nombre}
                            <span className={`badge ${claseStock}`}>
                                {estadoStock}
                            </span>
                        </h2>

                        <div className="">
                            <span className="h4 text-success">
                                ${precio.toLocaleString("es-CO")}
                            </span>
                        </div>

                        <p>
                            <strong>Descripción:</strong> {descripcion}
                        </p>

                        <div className="d-flex align-items-center ">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={decrementar}
                                disabled={cantidad <= 1}
                            >−</button>
                            <input
                                type="text"
                                value={cantidad}
                                readOnly
                                className="form-control text-center mx-2"
                                style={{ width: 60 }}
                            />
                            <button
                                className="btn btn-outline-secondary"
                                onClick={incrementar}
                                disabled={cantidad >= stock}
                            >+</button>
                        </div>
                    </div>

                    <div className="d-flex flex-column flex-sm-row gap-2">
                        <button
                            className="btn btn-dark flex-fill"
                            disabled={stock <= 0}
                            onClick={onAgregar}
                        >
                            Añadir {cantidad} al Carrito
                        </button>
                        <button
                            className="btn btn-success flex-fill"
                            disabled={stock <= 0}
                        >
                            Comprar Ahora
                        </button>
                    </div>

                    <div className="mt-3 text-muted small">
                        <p><strong>Categoría:</strong> {categoria}</p>
                        <p><strong>Subcategoría:</strong> {subcategoria}</p>
                    </div>
                </div>
            </div>
        </div>
    );

}
