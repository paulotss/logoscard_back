'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Comando para ADICIONAR a nova coluna 'pagbank_subscription_id' na tabela 'assignments'
    await queryInterface.addColumn('assignments', 'pagbank_subscription_id', {
      type: Sequelize.STRING,
      allowNull: true, // Permite que seja nulo (para assinaturas antigas ou manuais)
      after: 'plan_id' // Opcional: Coloca a coluna depois da coluna 'plan_id' para organização
    });
  },

  async down(queryInterface, Sequelize) {
    // Comando para REMOVER a coluna, caso você precise reverter (desfazer) a migration
    await queryInterface.removeColumn('assignments', 'pagbank_subscription_id');
  }
};
