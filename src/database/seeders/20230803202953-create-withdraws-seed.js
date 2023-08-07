/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('withdraws', [
      {
        amount: 25,
        description: 'teste1',
        created_at: '2023-08-03',
        updated_at: '2023-08-03',
        user_id: 1,
      },
      {
        amount: 1,
        description: 'teste2',
        created_at: '2023-08-03',
        updated_at: '2023-08-03',
        user_id: 2,
      },
      {
        amount: 1,
        description: 'teste3',
        created_at: '2023-08-03',
        updated_at: '2023-08-03',
        user_id: 3,
      },
      {
        amount: 1,
        description: 'teste4',
        created_at: '2023-08-03',
        updated_at: '2023-08-03',
        user_id: 4,
      },
      {
        amount: 1,
        description: 'teste5',
        created_at: '2023-08-03',
        updated_at: '2023-08-03',
        user_id: 5,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('withdraws', null, {});
  },
};
