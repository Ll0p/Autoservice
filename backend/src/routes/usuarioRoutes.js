import { Router } from "express";
import { createUsuario } from "../controllers/usuarioController.js";

const router = Router();

router.post("/", createUsuario);