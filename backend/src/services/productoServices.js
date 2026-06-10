import { ProductoInexistenteError } from "../errors/ErrorApp.js";
import { Producto } from "../models/index.js";
import { buscarProducto, verificarProducto } from "../utils/productoUtils.js";

// Listar productos con paginación. Si 'soloActivos' es true, filtra para el cliente.
export const listarProductosPaginados = (page = 1, limit = 6, soloActivos = false) => {
    const offset = (page - 1) * limit;
    const whereClause = soloActivos ? { activo: true } : {}; // El cliente solo ve activos [cite: 114, 129]

    return Producto.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset)
    }).then(resultado => {
        return {
            totalItems: resultado.count,
            paginasTotales: Math.ceil(resultado.count / limit),
            paginaActual: parseInt(page),
            productos: resultado.rows
        };
    });
};

// Buscar un producto por ID (útil para la pantalla de detalle o edición)
export const leerProductoPorId = (id) => buscarProducto(id).then(verificarProducto);

// Crear producto (activo por defecto) 
export const crearProducto = (datos) => Producto.create(datos);

// Hay logica repetida, pero no molesta por ahora, tengo que ver como lo hago mas declarativo
// Modificar producto
export const actualizarProducto = (id, datosActualizados) => {
    return Producto.update(datosActualizados, { where: { id } })
        .then(([rowsUpdated]) => {
            if (rowsUpdated === 0) throw new ProductoInexistenteError();
            return { mensaje: "Producto actualizado con éxito" };
        });
};

// Cambiar estado (Baja lógica / Reactivación)
export const cambiarEstadoProducto = (id, nuevoEstado) => {
    return Producto.update({ activo: nuevoEstado }, { where: { id } })
        .then(([rowsUpdated]) => {
            if (rowsUpdated === 0) throw new ProductoInexistenteError();
            return { mensaje: `Producto ${nuevoEstado ? 'activado' : 'desactivado'} con éxito` };
        });
};