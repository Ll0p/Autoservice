import bcrypt from "bcrypt";

export async function encriptarContrasenia(contrasenia) {
    const sal = await bcrypt.genSalt(10);
    const contraEncriptada = await bcrypt.hash(contrasenia, sal);
    return contraEncriptada;
}