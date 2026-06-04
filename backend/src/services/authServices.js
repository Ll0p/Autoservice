import bcrypt from "bcrypt";
import { Usuario } from "../models/index.js";
import { UsuarioInexistenteError, ContraseniaIncorrectaError } from "../errors/ErrorApp.js";

function compararContrasenias(contra1, contra2) {
    return bcrypt.compare(contra1, contra2);
}

export function autenticarUsuario(correo, contrasenia) {

    const validarUsuario = (usuario) => {
        if (!usuario) throw new UsuarioInexistenteError();
        return usuario;
    }

    const validarContra = (usuario) => {
        const evaluarContra = (coinciden) => {
            if (!coinciden) throw new ContraseniaIncorrectaError();
            return usuario;
        };
        return compararContrasenias(contrasenia, usuario.contrasenia).then(evaluarContra);
    }

    return Usuario.findOne({ where: { correo } })
        .then(validarUsuario)
        .then(validarContra);
}