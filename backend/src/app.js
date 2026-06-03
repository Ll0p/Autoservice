import express from 'express';
import sequelize from './config/database.js'; 
import {router as usuarioRouter} from "./routes/usuarioRoutes.js"

const app = express();
const PUERTO = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/usuarios", usuarioRouter);

async function iniciarServidor() {

    const sincronizar = () => sequelize.sync({ alter: true });

    const mostrarExito = () => {
        console.log('\n--> Conexión exitosa a MySQL...');
        app.listen(PUERTO, () => console.log(`--> Servidor en puerto ${PUERTO} en modo ${process.env.NODE_ENV}...`));
    };

    const mostrarError = (error) => console.error(`--> Error de conexión: ${error}`);

    sequelize.authenticate()
        .then(sincronizar)
        .then(mostrarExito)
        .catch(mostrarError);
}

iniciarServidor();