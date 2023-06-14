/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users_plans', [
      {
        user_id: 1,
        plan_id: 1,
        created_at: '1995-12-17T03:24:00',
      },
      {
        user_id: 1,
        plan_id: 2,
        created_at: '1995-12-17T03:24:00',
      },
      {
        user_id: 2,
        plan_id: 3,
        created_at: '1995-12-17T03:24:00',
      },
      {
        user_id: 3,
        plan_id: 2,
        created_at: '1995-12-17T03:24:00',
      },
      {
        user_id: 4,
        plan_id: 3,
        created_at: '1995-12-17T03:24:00',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users_plans', null, {});
  },
};
