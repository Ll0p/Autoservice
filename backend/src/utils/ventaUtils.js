import { Venta, VentaProducto } from "../models/index.js";

export const guardarVenta = (nombreCliente, total) => Venta.create({nombreCliente: nombreCliente, total: total});

export const guardarDetallesVenta = (productos) => (nuevaVenta) => {
    const detallesVenta = productos.map(prod => ({
        venta_id: nuevaVenta.id,
        producto_id: prod.id,
        cantidad: prod.cantidad,
        precio_unitario: prod.precio 
    }));

    return VentaProducto.bulkCreate(detallesVenta).then(() => nuevaVenta);
};