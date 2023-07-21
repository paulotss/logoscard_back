import { Model, DataTypes } from 'sequelize';
import db from '.';
import UserModel from './user.model';

class DependentModel extends Model {
  declare id: number;

  declare userId: number;

  declare assignmentId: number;
}

DependentModel.init(
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
    assignmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'assignments',
        },
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    underscored: true,
    timestamps: false,
    modelName: 'DependentModel',
    tableName: 'dependents',
  },
);

DependentModel.belongsTo(UserModel);

export default DependentModel;
