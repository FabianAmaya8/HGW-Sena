export function initHeader() {
  // Crear elementos del header
  const headerPrincipal = document.createElement('header');
  const headerDiv = document.createElement('div');
  headerDiv.className = 'header-content';

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.className = 'logo';
  const logoImg = document.createElement('img');
  logoImg.src = './static/User/img/logo.png';
  logoImg.alt = 'logo';
  logoDiv.appendChild(logoImg);

  // Buscador
  const buscadorDiv = document.createElement('div');
  buscadorDiv.className = 'buscardor';
  const form = document.createElement('form');
  const inputText = document.createElement('input');
  inputText.className = 'buscador-tex';
  inputText.id = 'buscador';
  inputText.type = 'text';
  inputText.placeholder = 'Buscador';
  const lupita = document.createElement('i');
  lupita.className = 'bx bx-search';
  const inputSubmit = document.createElement('button');
  inputSubmit.className = 'buscador-btn';
  inputSubmit.type = 'submit';
  inputSubmit.appendChild(lupita);
  form.appendChild(inputText);
  form.appendChild(inputSubmit);
  buscadorDiv.appendChild(form);

  // Navegación (solo para visitantes)
  const nav = document.createElement('nav');
  nav.className = 'nav-general';

  const links = [
    { href: '/', text: 'Inicio', folder: 'View/index' },
    { href: '/ViewCatalogo', text: 'Catalogo', folder: 'View/catalogo' },
  ];
  links.forEach(link => {
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = link.href;
    a.dataset.folder = link.folder;
    a.textContent = link.text;
    nav.appendChild(a);
  });

  // Desplegable con detalles personales (visitante)
  const desplegableDiv = document.createElement('div');
  desplegableDiv.className = 'desplegable';
  const details = document.createElement('details');
  details.className = 'contenedor-personal';
  const summary = document.createElement('summary');
  summary.className = 'personal';
  const personalImgDiv = document.createElement('div');
  personalImgDiv.className = 'personal-img';
  const personalImg = document.createElement('i');
  personalImg.className = 'bx bxs-user-circle';
  personalImgDiv.appendChild(personalImg);
  summary.appendChild(personalImgDiv);
  details.appendChild(summary);

  // Lista desplegable (visitante)
  const ul = document.createElement('ul');
  const opciones = [
    { href: '#', text: 'Login' },
    { href: '#', text: 'Descargar APP' }
  ];
  opciones.forEach(opcion => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = opcion.href;
    a.textContent = opcion.text;

    if (opcion.text === 'Login') a.id = 'loginModal';

    li.appendChild(a);
    ul.appendChild(li);
  });

  details.appendChild(ul);
  desplegableDiv.appendChild(details);
  nav.appendChild(desplegableDiv);

  // Añadir desplegable al header
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'btn-header';
  const label = document.createElement('label');
  label.htmlFor = 'btn-header';
  label.className = 'btn-header';
  const icon = document.createElement('i');
  icon.className = 'bx bx-menu';
  label.appendChild(icon);
  const titulo = document.createElement('h2');
  titulo.textContent = 'HGW';

  // Añadir elementos al header
  headerPrincipal.appendChild(checkbox);
  headerPrincipal.appendChild(label);
  headerPrincipal.appendChild(titulo);
  headerDiv.appendChild(logoDiv);
  headerDiv.appendChild(buscadorDiv);
  headerDiv.appendChild(nav);
  headerPrincipal.appendChild(headerDiv);
  document.body.prepend(headerPrincipal);

  // Detectar la carpeta actual usando la ruta completa del directorio
  const currentPath = window.location.pathname;
  const currentFolder = currentPath.includes('/')
    ? currentPath.split('/').slice(1, -1).join('/')
    : 'root';

  // Seleccionar todos los enlaces de la navegación
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.dataset.folder === currentFolder) {
      link.classList.add('nav-selec');
    } else {
      link.classList.remove('nav-selec');
    }
  });
}
