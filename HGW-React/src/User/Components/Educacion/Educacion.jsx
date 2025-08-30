import '../../../assets/css/educacion.css';
;
function Educacion() {

    return (
        <div className="educacion container py-5">
            {/* Video Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card bg-transparent border-0 shadow-sm">
                        <div className="row g-0 align-items-center">
                            <div className="col-md-6 mb-3 mb-md-0">
                                <div className="ratio ratio-16x9">
                                    <video src="tu-video.mp4" controls className="w-100 rounded"></video>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card-body">
                                    <h1 className="card-title">Sistema Multinivel y Plataforma de Aprendizaje</h1>
                                    <p className="card-text">Educación Multinivel y Productos Naturistas</p>
                                    <div className="mb-3">
                                        <span className="badge bg-secondary me-2">Multinivel</span>
                                        <span className="badge bg-secondary">Naturistas</span>
                                    </div>
                                    <button className="btn btn-primary">Ver Video</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards Section */}
            <section className="row g-4">
                <div className="col-md-4">
                    <div className="card h-100 text-center educacion-card">
                        <div className="card-body d-flex flex-column">
                            <h3 className="card-title">Capacitación Básica</h3>
                            <p className="card-text flex-grow-1">
                                Aprende lo esencial para iniciar en el mundo del marketing multinivel. Conoce cómo funciona el sistema, cómo invitar personas y cómo generar ingresos desde tu red.
                            </p>
                            <a href="/multinivel" className="btn btn-outline-dark mt-3">Ver más</a>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 text-center educacion-card">
                        <div className="card-body d-flex flex-column">
                            <h3 className="card-title">Productos Naturistas</h3>
                            <p className="card-text flex-grow-1">
                                Ofrecemos productos naturales que apoyan tu bienestar y salud de forma integral. Desde suplementos hasta soluciones herbales, cada producto está pensado para cuidar tu cuerpo de manera natural y efectiva.
                            </p>
                            <a href="/productos" className="btn btn-outline-dark mt-3">Ver más</a>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 text-center educacion-card">
                        <div className="card-body d-flex flex-column">
                            <h3 className="card-title">Explicación Membresías</h3>
                            <p className="card-text flex-grow-1">
                                Accede a contenido exclusivo, herramientas de crecimiento y capacitaciones personalizadas según tu nivel. Con nuestras membresías, obtienes beneficios únicos para avanzar en tu camino dentro del sistema educativo y potenciar tu red.
                            </p>
                            <a href="/" className="btn btn-outline-dark mt-3">Ver más</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Educacion;