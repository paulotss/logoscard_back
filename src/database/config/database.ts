import 'dotenv/config';
import { Options } from 'sequelize';

const config: Options = {
  username: process.env.DEV_DB_USER || 'root',
  password: process.env.DEV_DB_PASSWORD || '123456',
  database: process.env.DEV_DB_DATABASE || 'logoscard',
  host: process.env.DEV_DB_HOST || 'logoscard_db',
  port: Number(process.env.DEV_DB_PORT) || 3306,
  dialect: 'mysql',
};

export = config;
