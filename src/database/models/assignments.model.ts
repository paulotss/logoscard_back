import { DataTypes, Model } from 'sequelize';
import db from '.';
import PlanModel from './plan.model';
import BenefitModel from './benefit.model';
import AssignmentsBenefitsModel from './assignments.benefits.model';

class AssignmentsModel extends Model {
  declare id: number;

  declare expiration: string;

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

AssignmentsModel.belongsToMany(BenefitModel, {
  through: AssignmentsBenefitsModel,
  as: 'benefits',
  foreignKey: 'benefitId',
});
BenefitModel.belongsToMany(AssignmentsModel, {
  through: AssignmentsBenefitsModel,
  as: 'assignments',
  foreignKey: 'assignmentId',
});

export default AssignmentsModel;
