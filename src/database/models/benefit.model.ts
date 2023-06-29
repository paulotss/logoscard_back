import { DataTypes, Model } from 'sequelize';
import db from '.';
import PlanModel from './plan.model';

class BenefitModel extends Model {
  declare id: number;

  declare title: string;

  declare description: string;

  declare type: string;

  declare amount: number;

  declare planId: number;
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
    type: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    amount: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    planId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'plans',
        },
        key: 'id',
      },
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

PlanModel.hasMany(BenefitModel, { as: 'benefits', foreignKey: 'planId' });
BenefitModel.belongsTo(PlanModel, { as: 'plan' });

export default BenefitModel;
