import { Sequelize } from 'sequelize';
import * as config from '../config/database';
// import UserModel from './user.model';

const sequelize = new Sequelize(config);

export default sequelize;
