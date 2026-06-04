import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Configuramos dotenv manualmente ya que estamos en ES Modules
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false
    }
);

// Exportación nativa de ES Modules
export default sequelize;