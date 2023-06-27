/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('benefits', [
      {
        title: 'Teleatendimento médico',
        amount: 1,
        used: 1,
        type: 'active',
      },
      {
        title: 'Teleatendimento médico',
        amount: 1,
        used: 0,
        type: 'active',
      },
      {
        title: 'Teleatendimento médico',
        amount: null,
        used: null,
        type: 'passive',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('benefits', null, {});
  },
};
