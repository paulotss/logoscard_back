import { DataTypes, Model } from 'sequelize';
import db from '.';
import InvoiceModel from './invoice.model';
import AssignmentsModel from './assignments.model';

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

  declare birthday: string;
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
    birthday: {
      allowNull: false,
      type: DataTypes.DATE,
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

UserModel.hasOne(AssignmentsModel, { as: 'assignment', foreignKey: 'userId' });

UserModel.hasMany(InvoiceModel, { as: 'invoices', foreignKey: 'userId' });
InvoiceModel.belongsTo(UserModel, { as: 'user' });

export default UserModel;
