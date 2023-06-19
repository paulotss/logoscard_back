import { DataTypes, Model } from 'sequelize';
import db from '.';
import PlanModel from './plan.model';
import UserPlanModel from './user_plan.model';

class UserModel extends Model {
  declare id: number;

  declare firstName: string;

  declare lastName: string;

  declare email: string;

  declare cpf: string;

  declare password: string;

  declare admin: boolean;
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
    password: {
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
  },
  {
    sequelize: db,
    underscored: true,
    modelName: 'UserModel',
    timestamps: false,
    tableName: 'users',
  },
);

UserModel.belongsToMany(PlanModel, {
  as: 'plans',
  through: UserPlanModel,
  foreignKey: 'user_id',
  otherKey: 'plan_id',
});
PlanModel.belongsToMany(UserModel, {
  as: 'users',
  through: UserPlanModel,
  foreignKey: 'plan_id',
  otherKey: 'user_id',
});

export default UserModel;
