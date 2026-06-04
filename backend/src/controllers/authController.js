import bcrypt from "bcrypt";
import { Usuario } from "../models/index.js";
import { autenticarUsuario } from "../services/authServices.js";

export function loguear(req, res) {
    const { correo, contrasenia } = req.body;

    const responderExito = () => {
        return res.redirect("/admin/dashboard");
    };

    const manejarErrores = (error) => {
        if (error instanceof ServerError) return res.status(error.statusCode).render("login", { error: error.message })
        console.error(`Error no controlado: ${error}`);
        return res.status(500).send("Error en el servidor");
    };

    autenticarUsuario(correo, contrasenia)
        .then(responderExito)
        .catch(manejarErrores);
}

export function mostrarLogin(req, res) {
    res.render('login', { error: null });
};
