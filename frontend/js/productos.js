import { iniciarTema, toggleTema, obtenerNombre, obtenerCarrito, guardarCarrito, actualizarBadgeCarrito, mostrarToast, formatearPrecio } from "./utils.js";

iniciarTema();
actualizarBadgeCarrito();
document.getElementById('btnTema').addEventListener('click', toggleTema);

//si no hay nombre te manda al inicio otra vez
const nombre = obtenerNombre();
if (!nombre) {
    window.location.href = 'index.html';
}  

document.getElementById('saludo').textContent = `¡Hola ${nombre}! Explora nuestros productos`;

//datos harcodeados momentaneamente
// const PRODUCTOS = [
//     // Videojuegos
//     { id: 1,  nombre: 'The Legend of Zelda: Tears of the Kingdom', precio: 14999, imagen: null, tipo: 'videojuego', activo: true },
//     { id: 2,  nombre: 'Red Dead Redemption 2',                     precio: 9999,  imagen: null, tipo: 'videojuego', activo: true },
//     { id: 3,  nombre: 'God of War Ragnarök',                       precio: 12999, imagen: null, tipo: 'videojuego', activo: true },
//     { id: 4,  nombre: 'Elden Ring',                                precio: 11999, imagen: null, tipo: 'videojuego', activo: true },
//     { id: 5,  nombre: 'Hogwarts Legacy',                           precio: 10999, imagen: null, tipo: 'videojuego', activo: true },
//     { id: 6,  nombre: 'Spider-Man 2',                              precio: 13999, imagen: null, tipo: 'videojuego', activo: true },
//     { id: 7,  nombre: 'Cyberpunk 2077',                            precio: 8999,  imagen: null, tipo: 'videojuego', activo: true },
//     { id: 8,  nombre: 'FIFA 25',                                   precio: 11999, imagen: null, tipo: 'videojuego', activo: true },
//     { id: 9,  nombre: 'Baldur\'s Gate 3',                          precio: 12499, imagen: null, tipo: 'videojuego', activo: true },
//     { id: 10, nombre: 'Starfield',                                 precio: 9499,  imagen: null, tipo: 'videojuego', activo: true },
//     { id: 11, nombre: 'Alan Wake 2',                               precio: 10499, imagen: null, tipo: 'videojuego', activo: true },
//     { id: 12, nombre: 'Mortal Kombat 1',                           precio: 11499, imagen: null, tipo: 'videojuego', activo: true },
//     // Consolas
//     { id: 13, nombre: 'PlayStation 5 Slim',                        precio: 299999, imagen: null, tipo: 'consola', activo: true },
//     { id: 14, nombre: 'Xbox Series X',                             precio: 289999, imagen: null, tipo: 'consola', activo: true },
//     { id: 15, nombre: 'Nintendo Switch OLED',                      precio: 179999, imagen: null, tipo: 'consola', activo: true },
//     { id: 16, nombre: 'PlayStation 5 Digital Edition',             precio: 259999, imagen: null, tipo: 'consola', activo: true },
//     { id: 17, nombre: 'Xbox Series S',                             precio: 199999, imagen: null, tipo: 'consola', activo: true },
//     { id: 18, nombre: 'Nintendo Switch Lite',                      precio: 129999, imagen: null, tipo: 'consola', activo: true },
//     { id: 19, nombre: 'Steam Deck OLED',                           precio: 349999, imagen: null, tipo: 'consola', activo: true },
//     { id: 20, nombre: 'PlayStation 4 Slim',                        precio: 149999, imagen: null, tipo: 'consola', activo: true },
//     { id: 21, nombre: 'Xbox One S',                                precio: 139999, imagen: null, tipo: 'consola', activo: true },
// ];

const PRODUCTOS = []

const PRODUCTOS_POR_PAGINA = 9;
let categoriaActual = 'videojuego';
let paginaActual = 1;

const grid = document.getElementById('productosGrid');
const paginacion = document.getElementById('paginacion');
const tituloCateg = document.getElementById('tituloCategoria');

const countElementos = document.getElementById('productosCount');
const btnVideojuegos = document.getElementById('btnVideojuegos');
const btnConsolas = document.getElementById('btnConsolas');

//botones categorias
btnVideojuegos.addEventListener('click', () => cambiarCategoria('videojuego'));
btnConsolas.addEventListener('click', () => cambiarCategoria('consola'));

function cargarProductosDesdeApi() {

    const respuestaToJSON = (respuesta) => respuesta.json();

    const cargarProductos = (data) => {PRODUCTOS = data.productos};

    const enviarError = (error) => {
            console.error("Error al obtener los productos: ", error);
            grid.innerHTML = `<div class="productos-vacio"><p>Error al conectar con el servidor.</p></div>`;
        };

    fetch('http://localhost:3000/api/productos?limit=100')
        .then(respuestaToJSON)
        .then(cargarProductos)
        .then(renderProductos)
        .catch(enviarError);
}

function cambiarCategoria(categoria) {
    categoriaActual = categoria;
    paginaActual = 1;
    btnVideojuegos.classList.toggle('active', categoria === 'videojuego');
    btnConsolas.classList.toggle('active', categoria === 'consola');

    tituloCateg.textContent = categoria === 'videojuego' ? 'Videojuegos' : 'Consolas';
    renderProductos();
}

function renderProductos() {
    const filtrados = PRODUCTOS.filter(p => p.tipo === categoriaActual && p.activo);
    const total = filtrados.length;
    const totalPags = Math.ceil(total / PRODUCTOS_POR_PAGINA);

    if (paginaActual > totalPags) paginaActual = 1;
    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const pagina = filtrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);

    countElementos.textContent = `${total} productos${total !== 1 ? 's' : ''}`;
    
    if (pagina.length === 0) {
        grid.innerHTML = `
        <div class="productos-vacio">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <p>No hay productos disponibles en esta categoría.</p>
        </div>
        `
    } else {
        grid.innerHTML = pagina.map(p => crearCardHTML(p)).join('');
        agregarEventosCards();
    }

    renderPaginacion(totalPags);
}

//cards de productos
function crearCardHTML(producto) {
    const carrito = obtenerCarrito();
    const enCarrito= carrito.find(i => i.id === producto.id);
    const cantidad = enCarrito ? enCarrito.cantidad : 0;
    const imgHTML = producto.imagen
    ?   `<img class="producto-card__img" src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" />`
    :   `<div class="producto-card__img-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
            </svg>
        </div>`;
    const label = producto.tipo === 'videojuego' ? 'Videojuego' : 'Consola';
    return `
        <div class="producto-card" data-id="${producto.id}">
            <div class="producto-card__img-wrapper">
                ${imgHTML}
                <span class="producto-card__badge">${label}</span>
            </div>
        <div class="producto-card__body">
            <span class="producto-card__nombre">${producto.nombre}</span>
            <span class="producto-card__precio">${formatearPrecio(producto.precio)}</span>
        </div>
        <div class="producto-card__footer">
            ${cantidad === 0
            ? `
                <button class="btn-agregar" data-id="${producto.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Agregar
                </button>`
            : 
                `<div class="cantidad-control visible" data-id="${producto.id}">
                    <button class="cantidad-btn btn-restar" data-id="${producto.id}">−</button>
                    <span class="cantidad-num">${cantidad}</span>
                    <button class="cantidad-btn btn-sumar" data-id="${producto.id}">+</button>
                </div>`
            }
        </div>
    </div>  
    `;
}

//eventos de cards
function agregarEventosCards() {
    grid.querySelectorAll('.btn-agregar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            agregarAlCarrito(id);
        });
    });
    grid.querySelectorAll('.btn-sumar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            cambiarCantidad(id,1);
        });
    });
    grid.querySelectorAll('.btn-restar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            cambiarCantidad(id, -1);
        });
    });
}

function agregarAlCarrito(id) {
    const producto = PRODUCTOS.find(p => p.id === id);
    if (!producto) return;
    const carrito = obtenerCarrito();
    const idx = carrito.findIndex(i => i.id === id);

    if (idx === -1) {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            tipo: producto.tipo,
            cantidad: 1
        });
    } else {
        carrito[idx].cantidad++;
    }

    guardarCarrito(carrito);
    mostrarToast(`"${producto.nombre}" agregado al carrto`,'success');
    renderProductos();
}



function cambiarCantidad(id, delta) {
    const carrito = obtenerCarrito();
    const idx = carrito.findIndex(i => i.id ===id);
    if (idx === -1) return;

    carrito[idx].cantidad += delta;
    if (carrito[idx].cantidad <= 0) {
        carrito.splice(idx, 1);
        mostrarToast('Producto eliminado del carrito', 'info');
    }

    guardarCarrito(carrito);
    renderProductos();
}

function renderPaginacion(totalPags) {
    if (totalPags <= 1) {
        paginacion.innerHTML = '';
        return;
    }

    let html = '';
    html += `
    <button class="paginacion__btn" id="btnAnterior" ${paginaActual === 1 ? 'disabled' : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
        </svg>
    </button>`;

    for ( let i=1; i <= totalPags; i++) {
        html += `<button class="paginacion__btn ${i === paginaActual ? 'active' : ''}" data-pag="${i}">${i}</button>`;
    }

    html += `
    <button class="paginacion__btn" id="btnSiguiente" ${paginaActual === totalPags ? 'disabled' : ''}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
        </svg>
    </button>`;

    paginacion.innerHTML = html;
    document.getElementById('btnAnterior')?.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderProductos();
            scrollTo(0,0);
        }
    });
    document.getElementById('btnSiguiente')?.addEventListener('click',() => {
        if (paginaActual < totalPags) {
            paginaActual++;
            renderProductos();
            scrollTo(0,0);
        }
    });
    paginacion.querySelectorAll('[data-pag]').forEach(btn => {
        btn.addEventListener('click', () => {
            paginaActual = parseInt(btn.dataset.pag);
            renderProductos();
            scrollTo(0,0);
        });
    });
}

renderProductos();