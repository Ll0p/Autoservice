import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { activarProducto, createProducto, desactivarProducto, getProducto, getProductosAdmin,  getProductosCliente, updateProducto } from "../controllers/productoController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const router = Router();

// Configuración de Multer para almacenar imágenes en src/public/uploads 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Asegurate de crear físicamente la carpeta 'src/public/uploads'
        cb(null, path.join(__dirname, "../public/uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Ej: 1712345678-foto.jpg
    }
});

const upload = multer({ storage: storage });

// Rutas de la API de Productos [cite: 176]
router.get("/", getProductosCliente); // Vista cliente (solo activos) [cite: 114, 129]
router.get("/admin", getProductosAdmin); // Vista admin (todos) [cite: 162]
router.get("/:id", getProducto); // Detalle [cite: 194]

// Alta recibe una sola imagen cuyo campo en el formulario debe llamarse 'imagen' [cite: 103, 179]
router.post("/", upload.single("imagen"), createProducto); 
router.put("/:id", upload.single("imagen"), updateProducto); // Modificación [cite: 70, 117]

// Bajas y altas lógicas mediante PATCH [cite: 167, 168]
router.patch("/:id/desactivar", desactivarProducto);
router.patch("/:id/activar", activarProducto);

export default router;