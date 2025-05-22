export function ReferralModal() {
    // Crear el contenedor principal del modal
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal fade';
    modalDiv.id = 'referralModal';
    modalDiv.setAttribute('tabindex', '-1');
    modalDiv.setAttribute('aria-labelledby', 'modalLabel');
    modalDiv.setAttribute('aria-hidden', 'true');

    // Crear el diálogo del modal
    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog';

    // Crear el contenido del modal
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // --- Encabezado del modal ---
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    const modalTitle = document.createElement('h5');
    modalTitle.className = 'modal-title';
    modalTitle.id = 'modalLabel';
    modalTitle.textContent = 'Código de Referencia';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Cerrar');

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    // --- Cuerpo del modal ---
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';

    const p = document.createElement('p');
    p.textContent = 'Este es el código con el que puede referir a personas:';
    modalBody.appendChild(p);

    // Grupo de input
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'refCode';
    input.className = 'form-control';
    input.readOnly = true;

    const copyButton = document.createElement('button');
    copyButton.className = 'btn btn-outline-secondary modal-button';
    copyButton.id = 'copyBtn';
    copyButton.textContent = 'Copiar';

    inputGroup.appendChild(input);
    inputGroup.appendChild(copyButton);
    modalBody.appendChild(inputGroup);

    // --- Pie del modal ---
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';

    const continueButton = document.createElement('button');
    continueButton.type = 'button';
    continueButton.className = 'btn btn-success';
    continueButton.setAttribute('data-bs-dismiss', 'modal');
    continueButton.textContent = 'Continuar';

    modalFooter.appendChild(continueButton);

    // Construir la estructura del modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalDialog.appendChild(modalContent);
    modalDiv.appendChild(modalDialog);

    // Agregar el modal al cuerpo del documento
    document.body.appendChild(modalDiv);
}
