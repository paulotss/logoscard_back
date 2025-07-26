import { DataTypes, Model } from 'sequelize';
import db from '.';
import PlanModel from './plan.model';
import BenefitModel from './benefit.model';
import AssignmentsBenefitsModel from './assignments.benefits.model';

class AssignmentsModel extends Model {
  declare id: number;

  declare expiration: Date;

  declare planId: number;

  declare userId: number;

  declare pagbankSubscriptionId: string;
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
      field: 'plan_id',
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
      field: 'user_id',
      references: {
        model: {
          tableName: 'users',
        },
        key: 'id',
      },
    },

    pagbankSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'pagbank_subscription_id',
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

AssignmentsModel.hasMany(AssignmentsBenefitsModel, {
  as: 'assignmentBenefit',
  foreignKey: 'assignmentId',
});
AssignmentsBenefitsModel.belongsTo(AssignmentsModel, { as: 'assignment' });

BenefitModel.hasMany(AssignmentsBenefitsModel, {
  as: 'assignmentBenefit',
  foreignKey: 'benefitId',
});
AssignmentsBenefitsModel.belongsTo(BenefitModel, { as: 'benefit' });

export default AssignmentsModel;
