import { crearNuevaVenta } from "../services/ventaServices.js";
import { manejarErrores } from "../utils/utilidades.js";

export const createVenta = (req, res) => {
    const { nombreCliente, total, productos } = req.body;
    const datos = { nombreCliente, total, productos };

    const enviarExito = (nuevaVenta) => res.status(201).json({ status: true, venta: nuevaVenta, mensaje: "Venta registrada con éxito" });

    crearNuevaVenta(datos)
        .then(enviarExito)
        .catch(manejarErrores(res));
};