/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('phones', [
      {
        area: '61',
        number: '998585218',
      },
      {
        area: '61',
        number: '998585218',
      },
      {
        area: '61',
        number: '998585218',
      },
      {
        area: '61',
        number: '998585218',
      },
      {
        area: '61',
        number: '998585218',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('phones', null, {});
  },
};
