/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('plans', [
      {
        title: 'Seraphis Premium',
        price: 300,
      },
      {
        title: 'Maat Premium',
        price: 200,
      },
      {
        title: 'Seraphis Gold',
        price: 100,
      },
      {
        title: 'Maat Gold',
        price: 150,
      },
      {
        title: 'Seraphis Família',
        price: 500,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('plans', null, {});
  },
};
