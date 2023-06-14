import { DataTypes, Model } from 'sequelize';
import db from '.';

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

export default PlanModel;
