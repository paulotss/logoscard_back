import { Model, DataTypes } from 'sequelize';
import db from '.';
import UserModel from './user.model';

class ClientModel extends Model {
  declare id: number;

  declare userId: number;
}

ClientModel.init(
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
    modelName: 'ClientModel',
    tableName: 'clients',
  },
);

ClientModel.belongsTo(UserModel);

export default ClientModel;
