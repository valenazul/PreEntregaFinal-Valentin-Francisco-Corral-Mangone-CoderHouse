// URL de la API para obtener los productos (simulamos con un archivo JSON)
const apiURL = 'productos.json';

// Obtener el carrito del almacenamiento local o crear uno nuevo
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para agregar un producto al carrito
function agregarProducto(id) {
    fetch(apiURL)
        .then(response => response.json())
        .then(productos => {
            const producto = productos.find(p => p.id === id);
            carrito.push(producto);
            actualizarCarrito();
            mostrarModal(`Producto agregado: ${producto.nombre}`);
        })
        .catch(error => console.error('Error al agregar producto:', error));
}

// Función para finalizar la compra y mostrar el total
function finalizarCompra() {
    let total = 0;
    for (const producto of carrito) {
        total += producto.precio;
    }
    mostrarModal(`El total de la compra es: $${total}`);
    // Vaciar el carrito y actualizar en el almacenamiento local
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
}

// Función para actualizar la lista del carrito en el DOM
function actualizarCarrito() {
    const carritoList = document.getElementById("carritoList");
    carritoList.innerHTML = ''; // Limpiar lista

    carrito.forEach(function (producto) {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.textContent = `${producto.nombre} - Precio: $${producto.precio}`;
        carritoList.appendChild(li);
    });
}

// Función para mostrar los productos en el catálogo
async function mostrarCatalogo() {
    try {
        const response = await fetch(apiURL);
        const productos = await response.json();

        const productCatalog = document.getElementById("productCatalog");
        productos.forEach(function (producto) {
            const div = document.createElement("div");
            div.classList.add("producto", "col-md-4");

            const img = document.createElement("img");
            img.src = `images/${producto.imagen}`;
            img.alt = producto.nombre;
            div.appendChild(img);

            const boton = document.createElement("button");
            boton.classList.add("btn", "btn-success", "mt-2");
            boton.textContent = `Añadir al carrito`;
            boton.addEventListener("click", function () {
                agregarProducto(producto.id);
            });
            div.appendChild(boton);

            productCatalog.appendChild(div);
        });
    } catch (error) {
        console.error('Error al mostrar el catálogo:', error);
    }
}

// Función para mostrar un modal de Bootstrap
function mostrarModal(mensaje) {
    const modalHtml = `
        <div class="modal fade" id="modalMensaje" tabindex="-1" role="dialog" aria-labelledby="modalMensajeLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalMensajeLabel">Información</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${mensaje}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    $('#modalMensaje').modal('show');
    $('#modalMensaje').on('hidden.bs.modal', function () {
        document.getElementById('modalMensaje').remove();
    });
}

// Mostrar el catálogo al cargar la página
mostrarCatalogo();
