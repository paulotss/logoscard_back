import { DataTypes, Model } from 'sequelize';
import db from '.';
import AssignmentsBenefitsModel from './assignments.benefits.model';

class BenefitNoteModel extends Model {
  declare id: number;

  declare description: string;

  declare assignmentBenefitId: number;

  declare createdAt: string;

  declare updatedAt: string;
}

BenefitNoteModel.init(
  {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    description: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    assignmentBenefitId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'assignments_benefits',
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
    modelName: 'BenefitNoteModel',
    timestamps: true,
    tableName: 'benefits_notes',
  },
);

AssignmentsBenefitsModel.hasMany(BenefitNoteModel, {
  as: 'notes',
  foreignKey: 'assignmentBenefitId',
});
BenefitNoteModel.belongsTo(AssignmentsBenefitsModel, {
  as: 'benefit',
  foreignKey: 'id',
});

export default BenefitNoteModel;
