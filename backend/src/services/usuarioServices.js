import bcrypt from "bcrypt";
import { Usuario } from "../models/index.js";
import { UsuarioExistenteError } from "../errors/ErrorApp.js";

export const buscarUsuario = (correo) => Usuario.findOne({ where: {correo} });

const verificarDisponibilidad = (usuario, contrasenia) => {
    if (usuario) throw new UsuarioExistenteError();
    return contrasenia;
};

const encriptarContrasenia = (contrasenia) => bcrypt.hash(contrasenia, 10);

const guardarUsuario = (correo, contrasenia) => Usuario.create({ correo: correo, contrasenia: contrasenia });

export const registrarNuevoUsuario = (correo, contrasenia) => {
    return buscarUsuario(correo)
        .then(usuario => verificarDisponibilidad(usuario, contrasenia))
        .then(encriptarContrasenia)
        .then(contraEncriptada => guardarUsuario(correo, contraEncriptada));
};