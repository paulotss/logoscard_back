/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('benefits', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      amount: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      used: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('benefits');
  },
};
