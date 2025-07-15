import { DataTypes, Model } from 'sequelize';
import db from '.';

class InvoiceModel extends Model {
  declare id: number;
  declare amount: number;
  declare expiration: Date;
  declare paid: boolean;
  declare method: string;
  declare userId: number;
  declare pagbankSubscriptionId: string;
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
      defaultValue: false,
    },
    method: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
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
    modelName: 'InvoiceModel',
    tableName: 'invoices',
    timestamps: false,
  },
);

export default InvoiceModel;