import { alertaView } from './../productos/alerta-añadir.js';

// Función para formatear el precio con signo de pesos y separadores de miles
function formatPrice(price) {
  return `$${price.toLocaleString()}`;
}

// Función para crear un solo producto
function createProduct(categoria, subcategoria, name, price, imageUrl, stock, idProducto) {

  const imagenProductoUrl = 'static/' + imageUrl;

  const cartProducto = document.createElement('article');
  cartProducto.className = 'cart-producto';

  // Indicador de stock (punto de color)
  const stockIndicator = document.createElement('span');
  stockIndicator.classList.add('stock-indicator');
  if (stock > 10) {
    stockIndicator.classList.add('in-stock');
  } else if (stock > 0) {
    stockIndicator.classList.add('low-stock');
  } else {
    stockIndicator.classList.add('out-of-stock');
  }
  cartProducto.appendChild(stockIndicator);

  // Texto de stock
  const stockLabel = document.createElement('span');
  stockLabel.classList.add('stock-label');
  if (stock > 10) {
    stockLabel.textContent = 'Stock disponible';
    stockLabel.classList.add('in-stock');
  } else if (stock > 0) {
    stockLabel.textContent = `¡Solo ${stock} unidades!`;
    stockLabel.classList.add('low-stock');
  } else {
    stockLabel.textContent = 'Agotado';
    stockLabel.classList.add('out-of-stock');
  }
  cartProducto.appendChild(stockLabel);

  // Enlace a la página de detalle
  const productLink = document.createElement('a');
  productLink.href = '/usuario/catalogo/paginaproducto.html';
  productLink.setAttribute('aria-label', `Ver más sobre ${name}`);

  const bannerProductosDiv = document.createElement('figure');
  bannerProductosDiv.className = 'baner-productos';

  const productImg = document.createElement('img');
  productImg.src = imagenProductoUrl;
  productImg.alt = `Imagen del producto ${name}`;
  bannerProductosDiv.appendChild(productImg);

  // Sección de información
  const infoProductoDiv = document.createElement('section');
  infoProductoDiv.className = 'info-producto';

  // Categoría
  const productCategoria = document.createElement('p');
  productCategoria.textContent = categoria;
  productCategoria.className = 'categoria';
  infoProductoDiv.appendChild(productCategoria);

  // Subcategoría
  const productSubcategoria = document.createElement('p');
  productSubcategoria.textContent = subcategoria;
  productSubcategoria.className = 'subcategoria';
  infoProductoDiv.appendChild(productSubcategoria);

  // Nombre
  const productName = document.createElement('h3');
  productName.textContent = name;
  productName.className = 'nombre';
  infoProductoDiv.appendChild(productName);

  // Precio
  const productPrice = document.createElement('p');
  productPrice.textContent = formatPrice(price);
  productPrice.className = 'precio';
  infoProductoDiv.appendChild(productPrice);

  productLink.appendChild(bannerProductosDiv);
  productLink.appendChild(infoProductoDiv);
  cartProducto.appendChild(productLink);

  // Botón "Agregar al carrito"
  const productCarrito = document.createElement('button');
  productCarrito.textContent = "Agregar al carrito";
  productCarrito.className = 'btn-carrito';
  productCarrito.setAttribute('aria-label', `Agregar ${name} al carrito`);
  if (stock <= 0) {
    productCarrito.disabled = true;
    productCarrito.classList.add('btn-deshabilitado');
  }

  productCarrito.addEventListener('click', async () => {
    alertaView();
  });

  cartProducto.appendChild(productCarrito);

  return cartProducto;
}

// Función para cargar productos desde el backend
async function fetchProducts(limit = 10) {
  try {
    const response = await fetch(`/usuario/catalogo/obtener_productos?limit=${limit}`);
    const productos = await response.json();
    return productos;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
}

// Función para crear productos en los contenedores .carts
async function createProductsFromClass() {
  const cartsContainers = document.querySelectorAll('.carts');
  for (const container of cartsContainers) {
    const productCount = parseInt(container.classList[1], 10); // ej. 'carts 6'
    container.innerHTML = '';
    const productos = await fetchProducts(productCount);
    productos.forEach(p => {
      const product = createProduct(
        p.categoria,
        p.subcategoria,
        p.nombre,
        p.precio,
        p.imagen,
        p.stock,
        p.id_producto
      );
      container.appendChild(product);
    });
  }
}

// Inicializa al cargar la ventana
window.onload = createProductsFromClass;
