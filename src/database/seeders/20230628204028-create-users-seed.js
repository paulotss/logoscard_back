/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        first_name: 'Fulanoa',
        last_name: 'Um',
        cell_phone: '61998585218',
        email: 'fulanoaum@hefestos.com',
        cpf: '01810755123',
        rg: '2481942',
        password: '123456',
        birthday: '1986-9-9',
        access_level: 0,
      },
      {
        first_name: 'Fulanob',
        last_name: 'Dois',
        cell_phone: '61998585218',
        email: 'fulanobdois@hefestos.com',
        cpf: '01810755123',
        rg: '2481942',
        password: '123456',
        birthday: '1986-9-9',
        access_level: 2,
      },
      {
        first_name: 'Fulanoc',
        last_name: 'Três',
        cell_phone: '61998585218',
        email: 'fuloanoctres@hefestos.com',
        cpf: '01810755123',
        rg: '2481942',
        password: '123456',
        birthday: '1986-9-9',
        access_level: 2,
      },
      {
        first_name: 'Fulanod',
        last_name: 'Quatro',
        cell_phone: '61998585218',
        email: 'fulanodquatro@hefestos.com',
        cpf: '01810755123',
        rg: '2481942',
        password: '123456',
        birthday: '1986-9-9',
        access_level: 1,
      },
      {
        first_name: 'Fulanoe',
        last_name: 'Cinco',
        cell_phone: '61998585218',
        email: 'fuloanoecinco@hefestos.com',
        cpf: '01810755123',
        rg: '2481942',
        password: '123456',
        birthday: '1986-9-9',
        access_level: 1,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
