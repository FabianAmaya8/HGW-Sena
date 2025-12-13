import { Infinity } from "ldrs/react";
import { useEffect } from "react";
import useRed from "../../Hooks/personal/useRed";
import "../../../assets/css/personal/red.css";

export default function Red() {

    const {
        red,
        codigoPatrocinador,
        total,
        cargando,
        error,
        obtenerRed
    } = useRed();

    useEffect(() => {
        obtenerRed();
    }, []);

    if (cargando) {
        return (
            <div className="cargando">
                <Infinity size="120" stroke="10" color="#47BF26" />
            </div>
        );
    }

    if (error) return <p>Error: {error}</p>;

    return (
        <main className="container redContent">

            <h3>Mi red de referidos</h3>

            <div className="redResumen">
                <p><b>Mi código de patrocinador:</b> {codigoPatrocinador}</p>
                <p><b>Total de personas en mi red:</b> {total}</p>
            </div>

            <div className="redItems">
                {red.map((u) => (
                    <div key={u.id_usuario} className="red-card">

                        <div className="red-header">
                            <img 
                                src={u.url_foto_perfil} 
                                alt="perfil"
                            />

                            <div>
                                <h5>{u.nombre} {u.apellido}</h5>
                                <p>@{u.nombre_usuario}</p>
                            </div>
                        </div>

                        <div className="red-info">
                            <p><b>Nivel:</b> {u.nivel}</p>
                            <p><b>Correo:</b> {u.correo_electronico}</p>
                            <p><b>Tel:</b> {u.numero_telefono || "Sin teléfono"}</p>
                            <p><b>Membresía:</b> {u.nombre_membresia}</p>
                            <p><b>Puntos BV:</b> {u.puntos_bv}</p>
                            <p><b>Directos:</b> {u.total_red}</p>
                            <p><b>Registro:</b> {u.fecha_registro}</p>
                        </div>

                    </div>
                ))}

                {red.length === 0 && (
                    <p className="text-center">No tienes personas en tu red aún.</p>
                )}
            </div>

        </main>
    );
}
