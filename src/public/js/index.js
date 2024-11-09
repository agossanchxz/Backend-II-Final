const socket = io();

const listaProductos = document.getElementById('lista-productos');
const nuevoProductoInput = document.getElementById('nuevoProducto');
const agregarProductoBtn = document.getElementById('agregarProducto');
const productoEliminarInput = document.getElementById('productoEliminar');
const eliminarProductoBtn = document.getElementById('eliminarProducto');

// Actualizar la lista de productos
socket.on('actualizarProductos', (productos) => {
    listaProductos.innerHTML = '';
    productos.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = producto;
        listaProductos.appendChild(li);
    });
});

// Agregar nuevo producto
agregarProductoBtn.addEventListener('click', () => {
    const nuevoProducto = nuevoProductoInput.value;
    if (nuevoProducto) {
        socket.emit('nuevoProducto', nuevoProducto);
        nuevoProductoInput.value = '';
    }
});

// Eliminar producto
eliminarProductoBtn.addEventListener('click', () => {
    const productoEliminar = productoEliminarInput.value;
    if (productoEliminar) {
        socket.emit('eliminarProducto', productoEliminar);
        productoEliminarInput.value = '';
    }
});