/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('invoices', [
      {
        amount: 50,
        expiration: '1995-12-17',
        paid: 1,
        method: 'PIX',
        user_id: 1,
      },
      {
        amount: 34.2,
        expiration: '1995-12-17',
        paid: 1,
        method: 'CREDITO',
        user_id: 1,
      },
      {
        amount: 28.8,
        expiration: '1995-12-17',
        paid: 1,
        method: 'DINHEIRO',
        user_id: 1,
      },
      {
        amount: 102.4,
        expiration: '2024-12-17',
        paid: 0,
        method: 'DEBITO',
        user_id: 1,
      },
      {
        amount: 45.7,
        expiration: '2024-12-17',
        paid: 0,
        method: 'PIX',
        user_id: 1,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('invoices', null, {});
  },
};
