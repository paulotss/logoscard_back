import { Model, DataTypes } from 'sequelize';
import db from '.';

class AssignmentsBenefitsModel extends Model {
  declare amount: number;

  declare benefitId: number;

  declare assignmentId: number;
}

AssignmentsBenefitsModel.init(
  {
    amount: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },

    benefitId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'benefits',
        },
        key: 'id',
      },
    },

    assignmentId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'assignments',
        },
        key: 'id',
      },
    },
  },
  {
    sequelize: db,
    underscored: true,
    modelName: 'AssignmentBenefitModel',
    timestamps: false,
    tableName: 'assignments_benefits',
  },
);

export default AssignmentsBenefitsModel;
