import bcrypt from "bcrypt";
import { Usuario } from "../models/index.js";
import { UsuarioInexistenteError, ContraseniaIncorrectaError } from "../errors/ErrorApp.js";
import { buscarUsuario } from "./usuarioServices.js";

const validarUsuario = (usuario) => {
    if (!usuario) throw new UsuarioInexistenteError();
    return usuario;
};

const validarContra = (contrasenia, usuario) => {
    return bcrypt.compare(contrasenia, usuario.contrasenia)
        .then(coinciden => {
            if (!coinciden) throw new ContraseniaIncorrectaError(); 
            return usuario;
        });
};

export const autenticarUsuario = (correo, contrasenia) => {
    return buscarUsuario(correo)
        .then(validarUsuario)
        .then(usuario => validarContra(contrasenia, usuario));
};