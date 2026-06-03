import { Usuario } from "../models/index.js";
import { UsuarioExistenteError, ServerError, ErrorInterno } from "../errors/ErrorApp.js"
import { encriptarContrasenia } from "../services/usuarioServices.js";

export function createUsuario(req, res) {
    const { correo, contrasenia } = req.body;

    const verificarDisponibilidad = (usuarioExistente) => {
        if (usuarioExistente) throw new UsuarioExistenteError();
        return contrasenia;
    };

    const guardarUsuario = (contraseniaEncriptada) => {
        return Usuario.create({ correo, contrasenia: contraseniaEncriptada });
    };

    const responderExito = (nuevoUsuario) => {
        return res.status(201).json({id: nuevoUsuario.id, correo: nuevoUsuario.correo, mensaje: "Usuario administrador creado correctamente"});
    };

    const manejarErrores = (error) => {
        if (error instanceof ServerError) return res.status(error.statusCode).json(error.aResponse());
        console.error(`Error no controlado: ${error}`);
        const errorInesperado = new ErrorInterno();
        return res.status(errorInesperado.statusCode).json(errorInesperado.aResponse());
    };

    Usuario.findOne({ where: { correo } })
        .then(verificarDisponibilidad)
        .then(encriptarContrasenia) 
        .then(guardarUsuario)       
        .then(responderExito)       
        .catch(manejarErrores);     
}