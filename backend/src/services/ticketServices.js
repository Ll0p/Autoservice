import ejs from "ejs";
import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RUTA_PLANTILLA = path.join(__dirname, "../views/ticket.ejs");

const formatearMoneda = (valor) => new Intl.NumberFormat ("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
}).format(valor);

const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString("es-AR", {
    day: "2-digit", month:"2-digit", year:"numeric"
});



const amarDatosPlantilla = (venta) => {
    const productos = venta.productos.map((producto) => {
        const cantidad = producto.VentaProducto.cantidad;
        const precioUnitario = producto.VentaProducto.precioUnitario;
        const subtotal = cantidad * precioUnitario;
        return {
            nombre: producto.nombre,
            cantidad,
            precioUnitario: formatearMoneda(precioUnitario),
            subtotal: formatearMoneda(subtotal)
        };
    });
    return {
        id: venta.id,
        nombreCliente: venta.nombreCliente,
        fecha: formatearFecha(venta.fecha),
        total: formatearMoneda(venta.total),
        productos
    };
};

const renderizarHTML = (datosPlantilla) => ejs.renderFile(RUTA_PLANTILLA, datosPlantilla);
const generarPDFdesdeHTML = async (html) => {
    const navegador = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    try {


        const pagina = await navegador.newPage();
        await pagina.setContent(html, { waitUntil:"networkidle0"});
        return await pagina.pdf({
            format: "A4",
            printBackground: true,
            margin: {top:"20px", bottom:"20px", left:"20px",right:"20px"}

        });
    } finally {
        await navegador.close();
    }
};



export const generarTicketPDF = (venta) => {
    const datosPlantilla = amarDatosPlantilla(venta);
    return renderizarHTML(datosPlantilla).then(generarPDFdesdeHTML);
};



