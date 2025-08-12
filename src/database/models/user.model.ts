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

  declare rg: string;

  declare cpf: string;

  declare password: string;

  declare birthday: string;

  declare accessLevel: number;

  declare referenceId?: string;

  declare subscriptionId?: string;
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
    accessLevel: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    referenceId: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    subscriptionId: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
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

UserModel.hasMany(AssignmentsModel, {
  as: 'assignments',
  foreignKey: 'userId',
});

UserModel.hasMany(InvoiceModel, { as: 'invoices', foreignKey: 'userId' });
InvoiceModel.belongsTo(UserModel, { as: 'user' });

export default UserModel;
