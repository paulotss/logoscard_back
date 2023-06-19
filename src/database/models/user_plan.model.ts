import { DataTypes, Model } from 'sequelize';
import db from '.';

class UserPlanModel extends Model {
  declare expiration: string;
}

UserPlanModel.init(
  {
    expiration: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: db,
    underscored: true,
    modelName: 'UserPlanModel',
    timestamps: false,
    tableName: 'users_plans',
  },
);

export default UserPlanModel;
