import { buscarUsuario } from "./usuarioServices.js";
import { validarUsuario, validarContra } from "../utils/authUtils.js";

export const autenticarUsuario = (correo, contrasenia) => {
    return buscarUsuario(correo)
        .then(validarUsuario)
        .then(validarContra(contrasenia));
};