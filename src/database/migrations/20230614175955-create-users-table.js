/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      cell_phone: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      photo: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      rg: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      cpf: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
