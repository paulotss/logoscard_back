/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('invoices', [
      {
        amount: 50,
        expiration: '1995-12-17T03:24:00',
        paid: 1,
        user_id: 1,
      },
      {
        amount: 34.2,
        expiration: '1995-12-17T03:24:00',
        paid: 1,
        user_id: 1,
      },
      {
        amount: 28.8,
        expiration: '1995-12-17T03:24:00',
        paid: 1,
        user_id: 1,
      },
      {
        amount: 102.4,
        expiration: '2024-12-17T03:24:00',
        paid: 0,
        user_id: 1,
      },
      {
        amount: 45.7,
        expiration: '2024-12-17T03:24:00',
        paid: 0,
        user_id: 1,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('invoices', null, {});
  },
};
