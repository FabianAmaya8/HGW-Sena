export function initHeader() {
  // Crear elementos del header
  const headerPrincipal = document.createElement('header');
  const headerDiv = document.createElement('div');
  headerDiv.className= 'header-content';
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
  
  inputSubmit.appendChild(lupita)
  
  form.appendChild(inputText);
  form.appendChild(inputSubmit);
  buscadorDiv.appendChild(form);
  
  // Navegación
  const nav = document.createElement('nav');
  nav.className = 'nav-general';
  
  const links = [
    { href: '/inicio', text: 'Inicio', folder: 'User/inicio' },
    { href: '/educacion', text: 'Educacion', folder: 'usuario/educacion' },
    { href: '/catalogo', text: 'Catalogo', folder: 'Catalogo/catalogo' },
    { href: '/personal', text: 'Personal', folder: 'User/personal' },
    { href: '/carrito', text: 'Tu Carrito', folder: 'User/carrito' }
  ];
  links.forEach(link => {
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.href = link.href;
    a.dataset.folder = link.folder;
    
    if (link.text === 'Tu Carrito') {
      const icon = document.createElement('i');
      icon.className = 'bx bx-cart';
      
      const span = document.createElement('span');
      span.className = 'cart-count';
  
      let cartItemCount = 0;
      cartItemCount = cantidadProductosCarrito;
      span.textContent = cartItemCount;

  
      a.className = 'nav-link cart'
  
      a.appendChild(icon);
      a.appendChild(span);
    } else {
      a.textContent = link.text;
    }
  
    nav.appendChild(a);
  });
  
  
  // Desplegable con detalles personales
  const desplegableDiv = document.createElement('div');
  desplegableDiv.className = 'desplegable';

  const details = document.createElement('details');
  details.className = 'contenedor-personal';

  const summary = document.createElement('summary');
  summary.className = 'personal';

  const personalImgDiv = document.createElement('div');
  personalImgDiv.className = 'personal-img';

  // Aquí va la lógica de imagen o ícono según si hay o no foto
  if (typeof userProfilePictureUrl !== 'undefined' && userProfilePictureUrl) {
    const personalImg = document.createElement('img');
    personalImg.src = userProfilePictureUrl;
    personalImg.alt = 'Perfil';
    personalImgDiv.appendChild(personalImg);
  } else {
    const icon = document.createElement('i');
    icon.className = 'bx bxs-user-circle';
    personalImgDiv.appendChild(icon);
  }

  summary.appendChild(personalImgDiv);
  details.appendChild(summary);

  // Lista desplegable
  const ul = document.createElement('ul');

  const opciones = [
    { href: '/', text: 'cerrar sesion' },
    ...(userRol == 1 || userRol == 2 ? [{ href: '/Admin', text: 'administrador' }] : []),
    { href: '/Informacion-Personal', text: 'informacion personal' },
    { href: '#', text: 'referidos' },
    { href: '#', text: 'Descargar APP' }
  ];
  
  
  opciones.forEach(opcion => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = opcion.href;
    a.textContent = opcion.text;
  
    if (opcion.text === 'administrador') {
      a.id = 'adminPanel'
    }
    if (opcion.text === 'informacion personal') {
      a.id = 'infoPersonal'
    }
    if (opcion.text === 'referidos') {
      a.id = 'modalReferidos'
    } else {
      a.textContent = opcion.text;
    }
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
  
  // Crear el label
  const label = document.createElement('label');
  label.htmlFor = 'btn-header';
  label.className = 'btn-header';
  
  // Crear el ícono dentro del label
  const icon = document.createElement('i');
  icon.className = 'bx bx-menu';
  
  label.appendChild(icon);
  
  const titulo = document.createElement('h2');
  titulo.textContent = 'HGW';
  
  // Añadir elementos al header
  headerPrincipal.appendChild(checkbox);
  headerPrincipal.appendChild(label);
  headerPrincipal.appendChild(titulo);
  
  // Añadir todo al header
  headerDiv.appendChild(logoDiv);
  headerDiv.appendChild(buscadorDiv);
  headerDiv.appendChild(nav);
  
  // Agregar el header al cuerpo del documento
  headerPrincipal.appendChild(headerDiv);
  document.body.prepend(headerPrincipal);
  
  // Detectar la carpeta actual usando la ruta completa del directorio
  const currentPath = window.location.pathname;
  
  // Extraer la parte relevante de la ruta (excluyendo el archivo HTML)
  const currentFolder = currentPath.includes('/')
    ? currentPath.split('/').slice(1, -1).join('/')
    : 'root';
  
  // Seleccionar todos los enlaces de la navegación
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Recorrer los enlaces y agregar la clase 'nav-selec' al enlace correspondiente
  navLinks.forEach(link => {
    // Comprobar si el data-folder coincide con la carpeta actual
    if (link.dataset.folder === currentFolder) {
      link.classList.add('nav-selec');
    } else {
      // Asegurarse de que los demás enlaces no tengan la clase 'nav-selec'
      link.classList.remove('nav-selec');
    }
  });
}
