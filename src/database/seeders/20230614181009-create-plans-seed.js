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
        price: 300,
      },
      {
        title: 'Seraphis/Maat Gold',
        price: 408,
      },
      {
        title: 'Maat Família',
        price: 300,
      },
      {
        title: 'Seraphis Família',
        price: 300,
      },
      {
        title: 'Seraphis/Maat Família',
        price: 408,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('plans', null, {});
  },
};
