function cambiarCantidad(cantidad) {
    const progresoDiv = document.querySelector('.progreso');
    
    progresoDiv.innerHTML = '';

    cantidad = Math.min(cantidad, 5);

    for (let i = 0; i < cantidad; i++) {
        const div = document.createElement('div');
        div.className = 'si';
        progresoDiv.appendChild(div);
    }

    const rangoHonorDiv = document.querySelector('.rango-honor');
    if (cantidad===5) {
        rangoHonorDiv.style.display = 'block';
    }else{
        rangoHonorDiv.style.display = 'none';
    }
}