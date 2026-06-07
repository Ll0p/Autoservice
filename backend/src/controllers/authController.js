import { autenticarUsuario } from "../services/authServices.js";
import { ServerError } from "../errors/ErrorApp.js";

const responderExito = (res) => {
    req.session.usuarioId = true; // ?
    return res.redirect("/admin/dashboard");
}

const manejarErrores = (res, error) => {
    if (error instanceof ServerError) return res.status(error.statusCode).render("login", { error: error.message });
    console.error(`Error no controlado: ${error}`);
    return res.status(500).render("login", { error: "Error en el servidor" });
};

export const loguear = (req, res) => {
    const { correo, contrasenia } = req.body;
    autenticarUsuario(correo, contrasenia)
        .then(() => responderExito(res))
        .catch(error => manejarErrores(res, error));
};

export const mostrarLogin = (req, res) => res.render('login', { error: null });