export function initLogin() {
  // Elementos del DOM
    const openModalLink = document.getElementById('loginModal');

  // Al abrir el modal, generar un código y asignarlo al input
    openModalLink.addEventListener('click', function(e) {
        e.preventDefault();
        const modal = new bootstrap.Modal(document.getElementById('login-modal'));
        modal.show();
    });

    document.getElementById("loginModal").addEventListener("click", function () {
        setTimeout(() => {
            document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
        }, 100);
    });
}
