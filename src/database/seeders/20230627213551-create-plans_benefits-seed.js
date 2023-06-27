/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('plans_benefits', [
      {
        plan_id: 1,
        benefit_id: 1,
      },
      {
        plan_id: 1,
        benefit_id: 2,
      },
      {
        plan_id: 1,
        benefit_id: 3,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('plans_benefits', null, {});
  },
};
