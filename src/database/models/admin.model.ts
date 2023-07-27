import { Model, DataTypes } from 'sequelize';
import db from '.';
import UserModel from './user.model';

class AdminModel extends Model {
  declare id: number;

  declare userId: number;

  declare user: UserModel;
}

AdminModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'users',
        },
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    underscored: true,
    timestamps: false,
    modelName: 'AdminModel',
    tableName: 'admins',
  },
);

AdminModel.belongsTo(UserModel, { as: 'user' });

export default AdminModel;
