import { Model, DataTypes } from 'sequelize';
import db from '.';
import UserModel from './user.model';
import AssignmentsModel from './assignments.model';

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
      allowNull: false,
      references: {
        model: {
          tableName: 'users',
        },
        key: 'id',
      },
    },
    assignmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

DependentModel.belongsTo(UserModel, { as: 'user' });

DependentModel.belongsTo(AssignmentsModel, {
  as: 'assignments',
  foreignKey: 'assignment_id',
});

AssignmentsModel.hasMany(DependentModel, {
  as: 'dependents',
  foreignKey: 'assignment_id',
});

export default DependentModel;
