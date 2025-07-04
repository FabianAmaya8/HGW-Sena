function NivelMiembros({ level , membresias}) {

    const nombreMembresias = membresias?.map(m => m.nombre_membresia) || [];
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
                        <div key={i} className="si" />
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NivelMiembros
