export function mostrarModal(){
    function generarCodigo() {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let codigo = '';
        for (let i = 0; i < 16; i++) {
            codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
        return codigo;
    }
    
    // Elementos del DOM
    const openModalLink = document.getElementById('modalReferidos');
    const refCodeInput = document.getElementById('refCode');
    const copyBtn = document.getElementById('copyBtn');
    
    // Al abrir el modal, generar un código y asignarlo al input
    openModalLink.addEventListener('click', function(e) {
        e.preventDefault();
        refCodeInput.value = generarCodigo();
        const modal = new bootstrap.Modal(document.getElementById('referralModal'));
        modal.show();
    });
    
    // Función para copiar el código al portapapeles
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(refCodeInput.value).then(() => {
            alert('Código copiado: ' + refCodeInput.value);
        }).catch(err => console.error('Error al copiar: ', err));
    });

    document.getElementById("modalReferidos").addEventListener("click", function () {
        setTimeout(() => {
            document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
        }, 100);
    });
}