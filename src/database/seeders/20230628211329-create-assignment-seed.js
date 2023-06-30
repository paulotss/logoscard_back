/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('assignments', [
      {
        expiration: '2024-01-01',
        plan_id: 1,
        user_id: 5,
      },
      {
        expiration: '2024-01-01',
        plan_id: 1,
        user_id: 4,
      },
      {
        expiration: '2024-01-01',
        plan_id: 1,
        user_id: 3,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('assignments', null, {});
  },
};
