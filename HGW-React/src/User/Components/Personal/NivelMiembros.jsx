function NivelMiembros({ level , membresias}) {

    const nombreMembresias = membresias?.map(m => m.nombre_membresia) || [];
    const maxNiveles = 5;
    const nivelesAlcanzados = level || 0;
    const nivelesNoAlcanzados = maxNiveles - nivelesAlcanzados;

    return (
        <div className="conten-item">
            <div className="nivel-menbresia">
                <h2>Nivel de Membresía</h2>
                <div className="niveles">
                    {nombreMembresias.map((lvl) => (
                    <p key={lvl} className="nivel">{lvl}</p>
                    ))}
                </div>
                <div className="barra">
                    <div className="progreso">
                        {[...Array(level)].map((_, i) => (
                            <span key={i} className="si"></span>
                        ))}
                        {[...Array(nivelesNoAlcanzados)].map((_, i) => (
                            <span key={i} className="no"></span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NivelMiembros
