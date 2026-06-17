import { iniciarTema, toggleTema, limpiarSession ,limpiarCarrito , formatearPrecio} from './utils.js';

iniciarTema();
document.getElementById('btnTema').addEventListener('click', toggleTema);

let venta = null;
try {
    const raw = sessionStorage.getItem('nextplay_venta');
    if (raw) venta = JSON.parse(raw);
} catch {
    venta = null;
}

if (!venta || !venta.prodcutos || venta.productos.length === 0) {
    window.location.href = 'index.html';
}

document.getElementById('ticketNombre').textContent = venta.nombre;
document.getElementById('ticketFecha').textContent = venta.fecha;
document.getElementById('ticketTotal').textContent = formatearPrecio(venta.total);

const contenedorProductos = document.getElementById('ticketProductos');
contenedorProductos.innerHTML = venta.prodcutos.map(p => `
    <div class="ticket__producto">
        <div class="ticket__producto-info">
            <div class="ticket__producto-nombre">${p.nombre}</div>
            <div class="ticket__producto-detalle">
                ${p.tipo === 'videojuego' ? 'videojuego' : 'consola'} .
                ${formatearPrecio(p.precio)} c/u x ${p.cantidad}
            </div>
        </div>
        <div class="ticket__producto-subtotal">${formatearPrecio(p.precio * p.cantidad)}</div>
    </div>
    `).join('')

document.getElementById('btnDescargarPDF').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({unit: 'mm', format: 'a4'});
    const margen =20;
    const ancho = 210-margen*2;
    let y = 20;

    const lineaSimple = () => {
        doc.setDrawColor(200,200,220);
        doc.setLineWidth(0.3);
        doc.line(margen,y,210-margen,y);
        y += 6;
    };

    doc.set
})