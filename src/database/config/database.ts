import 'dotenv/config';
import { Options } from 'sequelize';

const config: Options = {
  username: process.env.DEV_DB_USER,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_DATABASE,
  host: process.env.DEV_DB_HOST,
  port: Number(process.env.DEV_DB_PORT),
  dialect: 'mysql',
};

export = config;
