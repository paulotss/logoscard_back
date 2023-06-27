import { DataTypes, Model } from 'sequelize';
import db from '.';
import PlanModel from './plan.model';
import PlanBenefitModel from './plan_benefit.model';

class BenefitModel extends Model {
  declare id: number;

  declare title: string;

  declare description: string;

  declare amount: number;

  declare used: number;

  declare type: string;
}

BenefitModel.init(
  {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    amount: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    used: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    underscored: true,
    modelName: 'BenefitModel',
    timestamps: false,
    tableName: 'benefits',
  },
);

BenefitModel.belongsToMany(PlanModel, {
  as: 'plans',
  through: PlanBenefitModel,
  foreignKey: 'benefit_id',
  otherKey: 'plan_id',
});
PlanModel.belongsToMany(BenefitModel, {
  as: 'benefits',
  through: PlanBenefitModel,
  foreignKey: 'plan_id',
  otherKey: 'benefit_id',
});

export default BenefitModel;
