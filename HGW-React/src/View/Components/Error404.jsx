import { useNavigate } from "react-router";

const Error404 = () => {
    const navigate = useNavigate();

    return (
        <div className="text-center cargando">
            <div className="row justify-content-center">
                <div className="card">
                    <div className="card-body">
                        <i className="bx bx-error"></i>
                        <h2 className="card-title">
                            Error 404: Página no encontrada
                        </h2>
                        <p className="card-text">Lo sentimos, pero la página que estás buscando no existe.</p>
                    </div>
                    <div className="card-footer">
                        <div className="d-flex gap-5 justify-content-center">
                            <button 
                                className="btn btn-primary"
                                onClick={() => navigate(-1)}
                            >
                                Volver atrás
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={() => navigate('/')}
                            >
                                Ir al inicio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error404;