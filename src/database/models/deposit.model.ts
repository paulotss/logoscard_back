import { DataTypes, Model } from 'sequelize';
import db from '.';

class DepositModel extends Model {
  declare id: number;

  declare amount: number;

  declare invoiceId: number;

  declare createdAt: string;

  declare updatedAt: string;
}

DepositModel.init(
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
    invoiceId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'invoices',
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
    modelName: 'DepositModel',
    timestamps: true,
    tableName: 'deposits',
  },
);

export default DepositModel;
