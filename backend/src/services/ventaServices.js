import {guardarVenta, guardarDetallesVenta, buscarVentaConDetalle, verificarVenta} from "../utils/ventaUtils.js"
export const crearNuevaVenta = (datosVenta) => {
    const { nombre_cliente, total, productos } = datosVenta;
    return guardarVenta(nombre_cliente, total).then(guardarDetallesVenta(productos));
};

export const leerVentaConDetalle = (id) => buscarVentaConDetalle(id).then(verificarVenta);