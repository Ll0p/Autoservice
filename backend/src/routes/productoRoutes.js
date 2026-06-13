import { Router } from "express";
import { activarProducto, createProducto, desactivarProducto, getProducto, getProductosAdmin, getProductosCliente, updateProducto } from "../controllers/productoController.js";
import { subidorArchivos } from "../utils/multerUtils.js";

export const router = Router();

// Rutas de la API de Productos [cite: 176]
router.get("/", getProductosCliente); // Vista cliente (solo activos) [cite: 114, 129]
router.get("/admin", getProductosAdmin); // Vista admin (todos) [cite: 162]
router.get("/:id", getProducto); // Detalle [cite: 194]

// Alta recibe una sola imagen cuyo campo en el formulario debe llamarse 'imagen' [cite: 103, 179]
router.post("/", subidorArchivos.single("imagen"), createProducto); 
router.put("/:id", subidorArchivos.single("imagen"), updateProducto); // Modificación [cite: 70, 117]

// Bajas y altas lógicas mediante PATCH [cite: 167, 168]
router.patch("/:id/desactivar", desactivarProducto);
router.patch("/:id/activar", activarProducto);

export default router;