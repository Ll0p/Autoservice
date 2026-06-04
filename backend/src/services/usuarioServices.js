import bcrypt from "bcrypt";
import { Usuario } from "../models/index.js";
import { UsuarioExistenteError } from "../errors/ErrorApp.js";

export function registrarNuevoUsuario(correo, contrasenia) {
    const verificarDisponibilidad = (usuarioExistente) => {
        if (usuarioExistente) throw new UsuarioExistenteError();
        return contrasenia;
    };

    const encriptarContrasenia = (contra) => bcrypt.hash(contra, 10);

    const guardarUsuario = (contraseniaEncriptada) => Usuario.create({ correo, contrasenia: contraseniaEncriptada });

    return Usuario.findOne({ where: { correo } })
        .then(verificarDisponibilidad)
        .then(encriptarContrasenia)
        .then(guardarUsuario)
}