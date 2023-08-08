/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('assignments_benefits', [
      {
        amount: 0,
        benefit_id: 1,
        assignment_id: 3,
      },
      {
        amount: 0,
        benefit_id: 2,
        assignment_id: 3,
      },
      {
        amount: null,
        benefit_id: 3,
        assignment_id: 3,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('assignments_benefits', null, {});
  },
};
