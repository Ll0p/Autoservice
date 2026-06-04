import { ServerError, ErrorInterno } from "../errors/ErrorApp.js"
import { registrarNuevoUsuario } from "../services/usuarioServices.js";

export function createUsuario(req, res) {
    const { correo, contrasenia } = req.body;

    const responderExito = (nuevoUsuario) => {
        return res.status(201).json({id: nuevoUsuario.id, correo: nuevoUsuario.correo, mensaje: "Usuario administrador creado correctamente"});
    };

    const manejarErrores = (error) => {
        if (error instanceof ServerError) return res.status(error.statusCode).json(error.aResponse());
        console.error(`Error no controlado: ${error}`);
        const errorInesperado = new ErrorInterno();
        return res.status(errorInesperado.statusCode).json(errorInesperado.aResponse());
    };
      
    registrarNuevoUsuario(correo, contrasenia)
        .then(responderExito)       
        .catch(manejarErrores);     
}