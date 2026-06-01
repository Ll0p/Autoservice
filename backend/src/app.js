import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database.js'; // <-- ¡Ojo con el .js al final!

dotenv.config();

const app = express();
const PUERTO = process.env.PORT || 3000;

app.use(express.json());

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a MySQL');

    app.listen(PUERTO, () => {
      console.log(`🚀 Servidor en puerto ${PUERTO} en modo ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}

iniciarServidor();