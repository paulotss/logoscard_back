/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('dependents', [
      {
        user_id: 4,
        assignment_id: 1,
      },
      {
        user_id: 5,
        assignment_id: 1,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('dependents', null, {});
  },
};
