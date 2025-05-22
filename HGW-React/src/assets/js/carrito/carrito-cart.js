export function carritoCart() {

    // Función para formatear el precio con signo de pesos y separadores de miles
    function formatPrice(price) {
        return `$${price.toLocaleString()}`;
    }
    
    async function createItemCarrito(name, price, imageUrl, cantidad = 1, id_producto) {
        const itemCarrito = document.createElement('div');
        itemCarrito.className = 'item-carrito';

        const producto = document.createElement('div');
        producto.className = 'cotenedor-producto';

        const imagenProducto = document.createElement('div');
        imagenProducto.className = 'imagen-producto';
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Imagen Del Producto';
        imagenProducto.appendChild(img);
        producto.appendChild(imagenProducto);

        const infoProducto = document.createElement('div');
        infoProducto.className = 'info-producto';

        const titulo = document.createElement('h3');
        titulo.textContent = name;
        const precio = document.createElement('span');
        precio.className = 'precio';
        precio.textContent = formatPrice(price);

        const precioModificado = document.createElement('div');
        precioModificado.className = 'precioModificado';
        precioModificado.textContent = `$${price.toFixed(2)}`;

        infoProducto.appendChild(titulo);
        infoProducto.appendChild(precio);
        infoProducto.appendChild(precioModificado);
        producto.appendChild(infoProducto);
        itemCarrito.appendChild(producto);

        const cantidadDiv = document.createElement('div');
        cantidadDiv.className = 'cantidad';

        const botonMenos = document.createElement('button');
        botonMenos.className = 'menos';
        botonMenos.textContent = '-';

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.value = cantidad.toString();
        inputCantidad.min = '1';

        const botonMas = document.createElement('button');
        botonMas.className = 'mas';
        botonMas.textContent = '+';

        const botnEliminar = document.createElement('button');
        const botonEliminar = document.createElement('i');
        botonEliminar.className = 'bx bxs-trash';
        botonEliminar.style.cursor = 'pointer';
        botonEliminar.title = "Eliminar";
        botonEliminar.addEventListener('click', () => {
            fetch(`/api/carrito/${id_producto}`, {
                method: 'DELETE'
            }).then(() => {
                itemCarrito.remove();
            });
        });

        botnEliminar.appendChild(botonEliminar);
        cantidadDiv.appendChild(botonMenos);
        cantidadDiv.appendChild(inputCantidad);
        cantidadDiv.appendChild(botonMas);
        cantidadDiv.appendChild(botnEliminar);
        itemCarrito.appendChild(cantidadDiv);

        const actualizarCantidad = (nuevaCantidad) => {
            fetch(`/api/carrito/${id_producto}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cantidad: nuevaCantidad })
            });
        };

        botonMenos.addEventListener('click', () => {
            let nuevaCantidad = parseInt(inputCantidad.value, 10);
            if (nuevaCantidad > 1) {
                nuevaCantidad--;
                inputCantidad.value = nuevaCantidad;
                actualizarCantidad(nuevaCantidad);
            }
        });

        botonMas.addEventListener('click', () => {
            let nuevaCantidad = parseInt(inputCantidad.value, 10) + 1;
            inputCantidad.value = nuevaCantidad;
            actualizarCantidad(nuevaCantidad);
        });

        return itemCarrito;
    }

    async function createItemsFromServer() {
        const cartsContainers = document.querySelectorAll('.productos');

        try {
            const response = await fetch('/api/carrito');
            const productosDesdeServidor = await response.json();

            if (Array.isArray(productosDesdeServidor) && productosDesdeServidor.length > 0) {
                cartsContainers.forEach(container => {
                    container.innerHTML = '';

                    productosDesdeServidor.forEach(producto => {
                        createItemCarrito(
                            producto.nombre_producto,
                            producto.precio_producto,
                            producto.imagen_producto
                                ? `/static/${producto.imagen_producto}`
                                : '',
                            producto.cantidad_producto,
                            producto.id_producto
                        ).then(item => container.appendChild(item));
                    });
                });
            } else {
                console.warn('No hay productos en el carrito.');
            }
        } catch (error) {
            console.error('Error al cargar productos del carrito:', error);
        }
    }

    window.addEventListener('load', createItemsFromServer);
}
