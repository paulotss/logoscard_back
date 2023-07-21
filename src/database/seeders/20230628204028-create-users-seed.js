/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        first_name: 'Fulanoa',
        last_name: 'Um',
        cell_phone: '61998585218',
        email: 'fulanoaum@hefestos.com',
        photo: 'paulo-perfil.jpg',
        cpf: '01810755123',
        rg: '2481942',
        password: '123456',
      },
      {
        first_name: 'Fulanob',
        last_name: 'Dois',
        cell_phone: '61998585218',
        email: 'fulanobdois@hefestos.com',
        photo: 'paulo-perfil.jpg',
        cpf: '01810755123',
        rg: '2481942',
        password: '123456',
      },
      {
        first_name: 'Fulanoc',
        last_name: 'Três',
        cell_phone: '61998585218',
        email: 'fuloanoctres@hefestos.com',
        photo: 'paulo-perfil.jpg',
        cpf: '01810755123',
        rg: '2481942',
        password: '123456',
      },
      {
        first_name: 'Fulanod',
        last_name: 'Quatro',
        cell_phone: '61998585218',
        email: 'fulanodquatro@hefestos.com',
        photo: 'paulo-perfil.jpg',
        cpf: '01810755123',
        rg: '2481942',
        password: '123456',
      },
      {
        first_name: 'Fulanoe',
        last_name: 'Cinco',
        cell_phone: '61998585218',
        email: 'fuloanoecinco@hefestos.com',
        photo: 'paulo-perfil.jpg',
        cpf: '01810755123',
        rg: '2481942',
        password: '123456',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
