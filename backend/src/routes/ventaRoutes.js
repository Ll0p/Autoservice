import { Router } from "express";
import { createVenta } from "../controllers/ventaController.js";

export const router = Router();

router.post("/", createVenta);

export default router;