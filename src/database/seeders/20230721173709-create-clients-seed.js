/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('clients', [
      {
        user_id: 2,
      },
      {
        user_id: 3,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('clients', null, {});
  },
};
