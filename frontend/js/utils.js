const TEMA_KEY = 'nextplay_tema';

export function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem(TEMA_KEY, tema);
    actualizarIconoTema(tema);
}
export function obtenerTema() {
    return localStorage.getItem(TEMA_KEY) || 'light';
}

export function toggleTema() {
    const actual = document.documentElement.getAttribute('data-theme') || 'light';
    const nuevo = actual === 'light' ? 'dark' : 'light';

    aplicarTema(nuevo)
}

function actualizarIconoTema(tema) {
    const sol = document.getElementById('iconoSol');
    const luna = document.getElementById('iconoLuna');
    if (!sol || !luna) return;
    if (tema === 'dark') {
        sol.style.display = 'block';
        luna.style.display= 'none';

    }   else {
        sol.style.display= 'none'
        luna.style.display = 'block' 
    }
}  


export function iniciarTema() {
    const tema = obtenerTema();
    aplicarTema(tema);
}

// Manejo de nombre de usuario
const NOMBRE_KEY = 'nextplay_nombre';
export function guardarNombre(nombre) {
    sessionStorage.setItem(NOMBRE_KEY, nombre.trim());
}

export function obtenerNombre() {
    return sessionStorage.getItem(NOMBRE_KEY) || null;
}

export function limpiarSession() {
    sessionStorage.clear();

}


const CARRITO_KEY = 'nextplay_carrito';

export function obtenerCarrito() {
    try {
        return JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];

    } catch {
        return [];
    }
}

export function guardarCarrito(carrito) {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    actualizarBadgeCarrito();
}

export function limpiarCarrito() {
    localStorage.removeItem(CARRITO_KEY);
    actualizarBadgeCarrito()
}

export function actualizarBadgeCarrito() {
    const badge = document.getElementById('carritoBadge');
    if (!bdage) return;

    const carrito= obtenerCarrito();
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    bdage.textContent = total;
    badge.style.display =total > 0 ? 'flex' : 'none';
}    

