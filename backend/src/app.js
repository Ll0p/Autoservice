import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database.js'; 
import {Producto, Usuario, Venta, VentaProducto} from "./models/index.js";

dotenv.config();

const app = express();
const PUERTO = process.env.PORT || 3000;

app.use(express.json());

async function iniciarServidor() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('✅ Conexión exitosa a MySQL');
        app.listen(PUERTO, () => {
            console.log(`🚀 Servidor en puerto ${PUERTO} en modo ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('❌ Error de conexión:', error);
    }
}

iniciarServidor();