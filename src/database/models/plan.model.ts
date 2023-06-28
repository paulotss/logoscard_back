import { DataTypes, Model } from 'sequelize';
import db from '.';
import UserModel from './user.model';

class PlanModel extends Model {
  declare id: number;

  declare title: string;

  declare price: number;
}

PlanModel.init(
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
    price: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
  },
  {
    sequelize: db,
    underscored: true,
    modelName: 'PlanModel',
    timestamps: false,
    tableName: 'plans',
  },
);

PlanModel.hasMany(UserModel, { as: 'users', foreignKey: 'plan_id' });
UserModel.belongsTo(PlanModel, { as: 'plan' });

export default PlanModel;
