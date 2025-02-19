const socket = io();

const listaProductos = document.getElementById('lista-productos');
const nuevoProductoInput = document.getElementById('nuevoProducto');
const agregarProductoBtn = document.getElementById('agregarProducto');
const productoEliminarInput = document.getElementById('productoEliminar');
const eliminarProductoBtn = document.getElementById('eliminarProducto');


const cartId = sessionStorage.getItem('cartId');

if (!cartId) {
    alert('No se encontró el carrito. Crea un carrito primero.');
} else {
   
    socket.on('actualizarProductos', (productos) => {
        listaProductos.innerHTML = '';
        productos.forEach(producto => {
            const li = document.createElement('li');
            li.textContent = producto.title;  // Asume que `producto.title` contiene el nombre del producto
            listaProductos.appendChild(li);
        });
    });


    agregarProductoBtn.addEventListener('click', () => {
        const nuevoProducto = nuevoProductoInput.value;
        if (nuevoProducto) {
            socket.emit('nuevoProducto', nuevoProducto);
            nuevoProductoInput.value = '';
        }
    });

    eliminarProductoBtn.addEventListener('click', () => {
        const productoEliminar = productoEliminarInput.value;
        if (productoEliminar) {
            socket.emit('eliminarProducto', productoEliminar);
            productoEliminarInput.value = '';
        }
    });

    document.querySelectorAll('.agregarCarrito').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            
            fetch(`/api/carts/${cartId}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Producto agregado al carrito');
                } else {
                    alert('Hubo un error al agregar el producto al carrito');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error');
            });
        });
    });
<<<<<<< HEAD
}
=======
}
>>>>>>> ef341824020be9515ccd08f2cf1affd2db50b060
