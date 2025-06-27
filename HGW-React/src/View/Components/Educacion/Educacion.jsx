import React from 'react';
import '../../../assets/css/educacion.css';
;
function Educacion() {
    const videoSection = (
        <div className="video-section-card">
            <div className="video-section">
                <div className="video-content">
                    <span className="live-badge">En Vivo</span>
                    <h1>Sistema Multinivel y Plataforma de Aprendizaje</h1>
                    <p>Educación Multinivel y Productos Naturistas</p>
                    <div className="tags">
                        <span className="tag">Multinivel</span>
                        <span className="tag">Naturistas</span>
                    </div>
                    <button className="btn-watch">Ver Video</button>
                </div>
                <div className="video-container">
                    <video src="tu-video.mp4" controls></video>
                </div>
            </div>
        </div>
    );

    return (
        <div className="app-container">
            {videoSection}

            <section className="dashboard">
                <a href="/temperatura" className="targeta-educacion">
                    <h3>Capacitación Básica</h3>
                    
                </a>

                <a href="/humedad" className="targeta-educacion">
                    <h3>Productos Naturistas</h3>
                    <p>Primero conoces la línea. Luego eliges según tu necesidad. Después descubres beneficios reales. A continuación conectas con tu bienestar. Finalmente compartes lo que amas.</p>
                    <span className="change negative">-5% desde ayer</span>
                </a>

                <a href="/valvula" className="targeta-educacion">
                    <h3>Herramientas de Gestión</h3>
                    <p className="closed">Cerrada</p>
                    <button className="btn">Cambiar Estado</button>
                </a>
            </section>

            <section className="config">
            </section>
        </div>
    );
}

export default Educacion;