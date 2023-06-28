import { Model } from 'sequelize';
import db from '.';

class PlanBenefitModel extends Model {}

PlanBenefitModel.init(
  {},
  {
    sequelize: db,
    underscored: true,
    modelName: 'PlanBenefitModel',
    timestamps: false,
    tableName: 'plans_benefits',
  },
);

export default PlanBenefitModel;
