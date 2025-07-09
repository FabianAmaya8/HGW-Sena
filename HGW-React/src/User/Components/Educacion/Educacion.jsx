import React from 'react';
import '../../../assets/css/educacion.css';
;
function Educacion() {
    const videoSection = (
        <div className="video-section-card">
            <div className="video-section">
                <div className="video-content">
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
                <a href="/multinivel" className="targeta-educacion">
                    <h3>Capacitación Básica</h3>
                    <p>Aprende lo esencial para iniciar en el mundo del marketing multinivel. Conoce cómo funciona el sistema, cómo invitar personas y cómo generar ingresos desde tu red.

                        Formación clara, práctica y pensada para que empieces con paso firme.</p>
                    <button className="btn">ver mas</button>
                </a>

                <a href="/productos" className="targeta-educacion">
                    <h3>Productos Naturistas</h3>
                    <p>Ofrecemos productos naturales que apoyan tu bienestar y salud de forma integral. Desde suplementos hasta soluciones herbales, cada producto está pensado para cuidar tu cuerpo de manera natural y efectiva.</p>
                    <button className="btn">ver mas</button>
                </a>

                <a href="/" className="targeta-educacion">
                    <h3>Explicacion menmbresias</h3>
                    <p className="closed">Accede a contenido exclusivo, herramientas de crecimiento y capacitaciones personalizadas según tu nivel. Con nuestras membresías, obtienes beneficios únicos para avanzar en tu camino dentro del sistema educativo y potenciar tu red.</p>
                    <button className="btn">ver mas</button>
                </a>
            </section>

            <section className="config">
            </section>
        </div>
    );
}

export default Educacion;