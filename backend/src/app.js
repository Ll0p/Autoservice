import express from 'express';
import path from "path";
import sequelize from './config/database.js'; 
import {router as usuarioRouter} from "./routes/usuarioRoutes.js"
import { fileURLToPath } from 'url';

const app = express();
const PUERTO = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/usuarios", usuarioRouter);

function iniciarServidor() {

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