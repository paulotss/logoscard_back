import { Model } from 'sequelize';
import db from '.';

class PlanBenefitModel extends Model {}

PlanBenefitModel.init(
  {},
  {
    sequelize: db,
    underscored: true,
    modelName: 'UserPlanModel',
    timestamps: false,
    tableName: 'users_plans',
  },
);

export default PlanBenefitModel;
