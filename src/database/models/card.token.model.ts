import { DataTypes, Model } from 'sequelize';
import db from '.';
import UserModel from './user.model';

class CardTokenModel extends Model {
  declare id: number;

  declare token: string;

  declare userId: number;

  declare createdBy: number;

  declare expiresAt: Date;

  declare isUsed: boolean;

  declare usedAt: Date | null;

  declare createdAt: Date;

  declare updatedAt: Date;

  // Associations
  declare user?: UserModel;

  declare creator?: UserModel;
}

CardTokenModel.init(
  {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    token: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(64),
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'user_id',
    },
    createdBy: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'created_by',
    },
    expiresAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'expires_at',
    },
    isUsed: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
      field: 'is_used',
    },
    usedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      field: 'used_at',
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    sequelize: db,
    underscored: true,
    modelName: 'CardTokenModel',
    tableName: 'card_tokens',
    timestamps: true,
  },
);

// Define associations
CardTokenModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user',
});

CardTokenModel.belongsTo(UserModel, {
  foreignKey: 'createdBy',
  as: 'creator',
});

export default CardTokenModel;
