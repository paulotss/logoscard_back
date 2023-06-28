import { DataTypes, Model } from 'sequelize';
import db from '.';
import InvoiceModel from './invoice.model';

class UserModel extends Model {
  declare id: number;

  declare firstName: string;

  declare lastName: string;

  declare email: string;

  declare cellPhone: string;

  declare photo: string;

  declare rg: string;

  declare cpf: string;

  declare password: string;

  declare admin: boolean;

  declare planId: number;
}

UserModel.init(
  {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    cellPhone: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    photo: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    rg: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    cpf: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    admin: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    planId: {
      allowNull: false,
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
    modelName: 'UserModel',
    timestamps: false,
    tableName: 'users',
  },
);

UserModel.hasMany(InvoiceModel, { as: 'invoices', foreignKey: 'user_id' });
InvoiceModel.belongsTo(UserModel, { as: 'user' });

export default UserModel;
