import { ProductoInexistenteError } from "../errors/ErrorApp.js";
import { Producto } from "../models/index.js";

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

// Buscar un producto por ID (útil para la pantalla de detalle o edición) [cite: 70, 194]
export const buscarProductoPorId = (id) => {
    const buscarProducto = (id) => Producto.findByPk(id);
    return buscarProducto(id)
        .then(producto => {
            if (!producto) throw new ProductoInexistenteError();
            return producto;
        });
};

// Crear producto (activo por defecto) [cite: 169]
export const registrarProducto = (datosProducto) => Producto.create(datosProducto);

// Modificar producto [cite: 166]
export const actualizarProducto = (id, datosActualizados) => {
    return Producto.update(datosActualizados, { where: { id } })
        .then(([rowsUpdated]) => {
            if (rowsUpdated === 0) throw new ProductoInexistenteError();
            return { mensaje: "Producto actualizado con éxito" };
        });
};

// Cambiar estado (Baja lógica / Reactivación) [cite: 167, 168]
export const cambiarEstadoProducto = (id, nuevoEstado) => {
    return Producto.update({ activo: nuevoEstado }, { where: { id } })
        .then(([rowsUpdated]) => {
            if (rowsUpdated === 0) throw new ProductoInexistenteError();
            return { mensaje: `Producto ${nuevoEstado ? 'activado' : 'desactivado'} con éxito` };
        });
};