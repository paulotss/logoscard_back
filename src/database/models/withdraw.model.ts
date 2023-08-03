import { DataTypes, Model } from 'sequelize';
import db from '.';

class WithdrawModel extends Model {
  declare id: number;

  declare amount: number;

  declare userId: number;

  declare createdAt: string;

  declare updatedAt: string;
}

WithdrawModel.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    amount: {
      allowNull: false,
      type: DataTypes.FLOAT,
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
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: db,
    underscored: true,
    modelName: 'WithdrawModel',
    timestamps: true,
    tableName: 'withdraws',
  },
);

export default WithdrawModel;
