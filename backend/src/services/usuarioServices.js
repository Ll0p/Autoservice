import bcrypt from "bcrypt";
import { Usuario } from "../models/index.js";
import { UsuarioExistenteError } from "../errors/ErrorApp.js";

function encriptarContrasenia(contrasenia) {
    return bcrypt.hash(contrasenia, 10);
}

export function registrarNuevoUsuario(correo, contrasenia) {
    const verificarDisponibilidad = (usuarioExistente) => {
        if (usuarioExistente) throw new UsuarioExistenteError();
        return contrasenia;
    };

    const guardarUsuario = (contraseniaEncriptada) => Usuario.create({ correo, contrasenia: contraseniaEncriptada });

    return Usuario.findOne({ where: { correo } })
        .then(verificarDisponibilidad)
        .then(encriptarContrasenia)
        .then(guardarUsuario)
}