export function ChatBot() {
    // Crear el contenedor principal
    const dropupDiv = document.createElement('div');
    dropupDiv.className = 'dropup-center dropup chat-bot';

    // Crear el botón
    const button = document.createElement('button');
    button.className = 'btn btn-secondary dropdown-toggle';
    button.type = 'button';
    button.setAttribute('data-bs-toggle', 'dropdown');
    button.setAttribute('aria-expanded', 'false');

    // Crear el ícono dentro del botón
    const icon = document.createElement('i');
    icon.className = 'bx bxs-bot';
    button.appendChild(icon);

    // Crear la lista desplegable
    const dropdownMenu = document.createElement('ul');
    dropdownMenu.className = 'dropdown-menu';

    // Elementos del menú
    const menuItems = ['Español', 'Ingles', 'Chat Bot'];
    
    menuItems.forEach(itemText => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'dropdown-item';
        a.href = '#';
        a.textContent = itemText;
        li.appendChild(a);
        dropdownMenu.appendChild(li);
    });

    // Agregar elementos al contenedor principal
    dropupDiv.appendChild(button);
    dropupDiv.appendChild(dropdownMenu);

    // Agregar al cuerpo del documento
    document.body.appendChild(dropupDiv);
}
