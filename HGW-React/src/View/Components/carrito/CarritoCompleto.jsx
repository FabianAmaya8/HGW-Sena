import { Link } from "react-router-dom";
import "../../../assets/css/CarritoCompleto.css";
import { useImageUrl } from "../../../User/Hooks/useImgUrl";
import Resumen from "./Resumen";
import { useEffect, useState } from "react";
import { formatPrice } from "../../hooks/useCarrito";

export default function Carrito({ carrito, aumentarCantidad, disminuirCantidad, quitarDelCarrito, actualizarCantidad, onNext }) {
    const [vacio, setLoading] = useState(true);

    useEffect(() => {
        setLoading(carrito.length === 0);
    }, [carrito]);


    return (
        <div className="container">
            <h2 className="titulo-principal">Resumen de Compra</h2>
            
            <div className="seccion-carrito">
                <div className="area-productos">
                    {vacio ? (
                        <div className="carrito-vacio">
                            <i className="bx bx-cart-download" style={{ fontSize: "70px", color: "#47BF26" }}></i>

                            <p className="mensaje-vacio mt-3">Tu carrito está vacío.</p>

                            <div className="acciones-vacio mt-3">
                                <Link to="/catalogo" className="btn btn-primary">
                                    Ir a comprar
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <table className="tabla-productos">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carrito.map(prod => (
                                    <CardProductoCarrito
                                        key={prod.id_producto}
                                        prod={prod}
                                        actualizarCantidad={actualizarCantidad}
                                        quitarDelCarrito={quitarDelCarrito}
                                        aumentarCantidad={aumentarCantidad}
                                        disminuirCantidad={disminuirCantidad}
                                    />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <Resumen
                    carrito={carrito}
                    loading={vacio}
                    step="cart"
                    onNext={onNext}
                />
            </div>
        </div>
    );
}

function CardProductoCarrito({ prod, quitarDelCarrito, aumentarCantidad, disminuirCantidad, actualizarCantidad }) {
    const imgUrl = useImageUrl(prod.imagen);
    const [tempCantidad, setTempCantidad] = useState(prod.cantidad);

    // Sincronizar cuando el carrito cambie
    useEffect(() => {
        setTempCantidad(prod.cantidad);
    }, [prod.cantidad]);

    const confirmarCambio = () => {
        const valor = Number(tempCantidad);

        if (valor !== prod.cantidad) {
            actualizarCantidad(prod.id_producto, valor);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.target.blur();
            confirmarCambio();
        }
    };

    return (
        <tr>
            <td>
                <Link to={`/producto/${prod.id_producto}`} className="imgProducto">
                    <img src={imgUrl} alt={prod.nombre}/>
                </Link>
            </td>
            <td>
                <Link 
                    to={`/producto/${prod.id_producto}`} 
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                    {prod.nombre}
                </Link>
            </td>
            <td>
                <div className="cantidad-controles">
                    <button className="btn-menos" onClick={() => disminuirCantidad(prod.id_producto)}>−</button>
                    <input
                        className="cantidad-numero"
                        type="number"
                        min="1"
                        max={prod.stock}
                        value={tempCantidad}
                        onChange={(e) => setTempCantidad(e.target.value)}
                        onBlur={confirmarCambio}
                        onKeyDown={handleKeyDown}
                        style={{ width: "70px", textAlign: "center" }}
                    />
                    <button className="btn-mas" onClick={() => aumentarCantidad(prod.id_producto)}>+</button>
                    
                </div>
                <button 
                    className="btn btn-sm btn-success btn-mas"
                    onClick={confirmarCambio}
                >
                    ✔
                </button>
            </td>
            <td>{formatPrice(prod.precio)}</td>
            <td>
                <button className="boton-quitar" onClick={() => quitarDelCarrito(prod.id_producto)}>
                    Quitar
                </button>
            </td>
        </tr>
    );
}
