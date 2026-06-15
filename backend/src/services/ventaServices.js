import {guardarVenta, guardarDetallesVenta} from "../utils/ventaUtils.js"
export const crearNuevaVenta = (datosVenta) => {
    const { nombre_cliente, total, productos } = datosVenta;
    return guardarVenta(nombre_cliente, total).then(guardarDetallesVenta(productos));
};