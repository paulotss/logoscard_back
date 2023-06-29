/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assignments_benefits', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },

      amount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      benefit_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'benefits',
          },
          key: 'id',
        },
      },

      assignment_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'assignments',
          },
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('assignments_benefits');
  },
};
