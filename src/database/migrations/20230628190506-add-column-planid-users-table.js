/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'plan_id', {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'plans',
        },
        key: 'id',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'plan_id');
  },
};
