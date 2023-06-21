import { DataTypes, Model } from 'sequelize';
import db from '.';

class InvoiceModel extends Model {
  declare id: number;

  declare amount: number;

  declare expiration: number;

  declare paid: boolean;

  declare userId: number;
}

InvoiceModel.init(
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
    expiration: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    paid: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    underscored: true,
    modelName: 'InvoiceModel',
    timestamps: false,
    tableName: 'invoices',
  },
);

export default InvoiceModel;
