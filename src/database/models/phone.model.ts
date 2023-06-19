import { DataTypes, Model } from 'sequelize';
import db from '.';

class PhoneModel extends Model {
  declare expiration: string;
}

PhoneModel.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    area: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    number: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    underscored: true,
    modelName: 'PhoneModel',
    timestamps: false,
    tableName: 'phones',
  },
);

export default PhoneModel;
