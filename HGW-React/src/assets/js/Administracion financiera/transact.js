function mostrar(id) {
    const elemento = document.getElementById(id);
    if (elemento.style.display === "none" || elemento.style.display === "") {
        elemento.style.display = "block";
    } else {
        elemento.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formTransaccion");

    if (formulario) {
        formulario.addEventListener("submit", function (e) {
            e.preventDefault();

            const emisor = document.getElementById("emisor").value;
            const receptor = document.getElementById("receptor").value;
            const saldo = parseFloat(document.getElementById("saldo_emisor").value);
            const cantidad = parseFloat(document.getElementById("cantidad").value);

            if (cantidad > saldo) {
                alert("❌ No tienes saldo suficiente para esta transacción.");
            } else {
                alert(`✅ Transferencia exitosa de ${cantidad} de ${emisor} a ${receptor}.`);
            }

            formulario.reset();
            mostrar('i1');
        });
    } else {
        console.error("No se encontró el formulario con id 'formTransaccion'");
    }
});
