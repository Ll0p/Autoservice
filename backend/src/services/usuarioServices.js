import bcrypt from "bcrypt";

export async function encriptarContrasenia(contrasenia) {
    return await bcrypt.hash(contrasenia, 10);
}