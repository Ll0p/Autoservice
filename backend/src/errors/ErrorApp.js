export class ServerError extends Error {
    constructor(statusCode, code, mensaje) {
        super(mensaje);
        this.statusCode = statusCode;
        this.code = code;
        this.name = "ServerError";
    }

    aResponse() {
        return {
            status: false,
            code: this.code,
            mensaje: this.mensaje
        }
    }
}

export class UsuarioExistenteError extends ServerError {
    constructor() {
        super(409, "EMAIL_YA_EXISTE", "El correo ya está registrado");
        this.name = "UsuarioExistenteError";
    }
}

export class ErrorInterno extends ServerError {
    constructor() {
        super(500, "ERROR_INTERNO_DEL_SERVER", "Ocurrió un error inesperado");
        this.name = "ErrorInterno";
    }
}