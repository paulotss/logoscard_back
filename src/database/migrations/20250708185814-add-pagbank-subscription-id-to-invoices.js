'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Comando para ADICIONAR a nova coluna na tabela 'invoices'
    await queryInterface.addColumn('invoices', 'pagbank_subscription_id', {
      type: Sequelize.STRING,
      allowNull: true, // Permite que seja nulo (para faturas antigas ou manuais)
      after: 'user_id' // Opcional: Coloca a coluna depois da coluna 'user_id'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('invoices', 'pagbank_subscription_id');
  }
};
