/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('deposits', [
      {
        amount: 50,
        created_at: '2023-08-03',
        updated_at: '2023-08-03',
        invoice_id: 1,
      },
      {
        amount: 34.2,
        created_at: '2023-08-03',
        updated_at: '2023-08-03',
        invoice_id: 2,
      },
      {
        amount: 28.8,
        created_at: '2023-08-03',
        updated_at: '2023-08-03',
        invoice_id: 3,
      },
      {
        amount: 102.4,
        created_at: '2023-08-03',
        updated_at: '2023-08-03',
        invoice_id: 4,
      },
      {
        amount: 45.7,
        created_at: '2023-08-03',
        updated_at: '2023-08-03',
        invoice_id: 5,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('deposits', null, {});
  },
};
