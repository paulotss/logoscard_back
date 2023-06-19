/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('phones', [
      {
        area: '61',
        number: '998585218',
        user_id: 1,
      },
      {
        area: '61',
        number: '998585218',
        user_id: 2,
      },
      {
        area: '61',
        number: '998585218',
        user_id: 3,
      },
      {
        area: '61',
        number: '998585218',
        user_id: 4,
      },
      {
        area: '61',
        number: '998585218',
        user_id: 5,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('phones', null, {});
  },
};
