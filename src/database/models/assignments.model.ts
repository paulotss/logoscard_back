import { DataTypes, Model } from 'sequelize';
import db from '.';
import PlanModel from './plan.model';

class AssignmentsModel extends Model {
  declare id: number;

  declare expiration: string;

  declare paid: number;

  declare planId: number;

  declare userId: number;
}

AssignmentsModel.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },

    expiration: {
      allowNull: false,
      type: DataTypes.DATE,
    },

    paid: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },

    planId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'plans',
        },
        key: 'id',
      },
    },

    userId: {
      allowNull: false,
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
    modelName: 'AssignmentModel',
    timestamps: false,
    tableName: 'assignments',
  },
);

PlanModel.hasMany(AssignmentsModel, {
  as: 'assignments',
  foreignKey: 'planId',
});
AssignmentsModel.belongsTo(PlanModel, { as: 'plan' });

export default AssignmentsModel;
