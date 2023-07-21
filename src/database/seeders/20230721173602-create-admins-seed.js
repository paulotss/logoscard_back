/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('admins', [
      {
        user_id: 1,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('admins', null, {});
  },
};
