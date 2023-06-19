/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        first_name: 'Fulanoa',
        last_name: 'Um',
        email: 'fulanoaum@hefestos.com',
        photo: 'paulo-perfil.jpg',
        cpf: '01810755123',
        rg: '2481942',
        password: '123456',
        admin: 1,
      },
      {
        first_name: 'Fulanob',
        last_name: 'Dois',
        email: 'fulanobdois@hefestos.com',
        photo: 'paulo-perfil.jpg',
        cpf: '01810755123',
        rg: '2481942',
        password: '123456',
        admin: 0,
      },
      {
        first_name: 'Fulanoc',
        last_name: 'Três',
        email: 'fuloanoctres@hefestos.com',
        photo: 'paulo-perfil.jpg',
        cpf: '01810755123',
        rg: '2481942',
        password: '123456',
        admin: 0,
      },
      {
        first_name: 'Fulanod',
        last_name: 'Quatro',
        email: 'fulanodquatro@hefestos.com',
        photo: 'paulo-perfil.jpg',
        cpf: '01810755123',
        rg: '2481942',
        password: '123456',
        admin: 0,
      },
      {
        first_name: 'Fulanoe',
        last_name: 'Cinco',
        email: 'fuloanoecinco@hefestos.com',
        photo: 'paulo-perfil.jpg',
        cpf: '01810755123',
        rg: '2481942',
        password: '123456',
        admin: 0,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
