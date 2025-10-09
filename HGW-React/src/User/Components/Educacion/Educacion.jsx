import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { useEducacion } from "../../Hooks/Educaciona/useEducacion";
import { getYouTubeId  } from "../../Hooks/Educaciona/useYoutube";
import { Infinity } from "ldrs/react";
import "../../../assets/css/educacion.css";
import { useState } from "react";

function Educacion() {
    const { temas, contenidos, loading, error } = useEducacion();
    const [activo, setActivo] = useState(null);

    if (loading) {
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

    if (error) {
        return (
            <div className="cargando">
                <i className="bx bx-error"></i>
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="educacion container py-5">
            <h1 className="text-center mb-4">Temas de Educación</h1>

            <div className="accordion" id="accordionTemas">
                {temas.map((tema) => {
                    const contenidosTema = contenidos.filter(
                        (c) => c.tema === tema.id_tema
                    );
                    const abierto = activo === tema.id_tema;

                    return (
                        <div key={tema.id_tema} className="accordion-item mb-2">
                            <h2 className="accordion-header">
                                <button
                                    className={`accordion-button ${abierto ? "" : "collapsed"}`}
                                    type="button"
                                    onClick={() =>
                                        setActivo(abierto ? null : tema.id_tema)
                                    }
                                >
                                    {tema.nombre_tema}
                                </button>
                            </h2>
                            <div className={`accordion-collapse collapse ${abierto ? "show" : ""}`}>
                                <div className="accordion-body">
                                    {contenidosTema.length === 0 ? (
                                        <p>No hay contenidos disponibles.</p>
                                    ) : (
                                        <ul className="list-unstyled">
                                            {contenidosTema.map((contenido) => {
                                                const videoId = getYouTubeId(contenido.url_contenido);

                                                return (
                                                    <li key={contenido.id_contenido} className="mb-4 temaContenido">
                                                        { videoId ?
                                                        (
                                                            <div className="video-wrapper">
                                                                <LiteYouTubeEmbed 
                                                                    id={videoId}
                                                                    title={`Video ${contenido.id_contenido}`}
                                                                    poster="mqdefault"
                                                                />
                                                            </div>
                                                        ):
                                                        (<a 
                                                            href={contenido.url_contenido} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="Texto"
                                                        >
                                                            <i className='bx bxs-file-pdf contenidoTexto-icon'></i>
                                                            Documento PDF
                                                        </a>)}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Educacion;
