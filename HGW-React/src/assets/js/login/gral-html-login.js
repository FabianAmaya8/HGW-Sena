export function htmlLogin() {
    // Evitar duplicados
    if (document.getElementById('login-modal')) return;

    // Modal wrapper
    const modal = document.createElement('div');
    modal.id = 'login-modal';
    modal.className = 'modal fade';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'loginModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    // Modal dialog
    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog modal-dialog-centered';

    // Modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // Modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    const title = document.createElement('h5');
    title.className = 'modal-title';
    title.id = 'loginModalLabel';
    title.textContent = 'Acción requerida';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close';
    closeBtn.setAttribute('data-bs-dismiss', 'modal');
    closeBtn.setAttribute('aria-label', 'Cerrar');

    modalHeader.appendChild(title);
    modalHeader.appendChild(closeBtn);

    // Modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body text-center';

    const message = document.createElement('p');
    message.textContent = 'Para continuar, por favor inicia sesión o crea una cuenta.';
    message.className = 'mb-0';

    modalBody.appendChild(message);

    // Modal footer
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer justify-content-center gap-3';

    const loginButton = document.createElement('a');
    loginButton.href = '/login';
    loginButton.className = 'btn btn-outline-primary modal-button';
    loginButton.textContent = 'Iniciar sesión';

    const registerButton = document.createElement('a');
    registerButton.href = '/register';
    registerButton.className = 'btn btn-primary modal-button';
    registerButton.textContent = 'Crear cuenta';

    modalFooter.appendChild(loginButton);
    modalFooter.appendChild(registerButton);

    // Ensamblar el modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);
    document.body.appendChild(modal);
}