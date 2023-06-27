/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('benefits', [
      {
        title: 'Teleatendimento médico',
        description:
          'Psicologia, massoterapia, clínica média, acupuntura ou nutrição',
        amount: 1,
        used: 1,
        type: 'active',
      },
      {
        title: 'Consulta em especialidades',
        description:
          'Psicologia, massoterapia, clínica média, acupuntura ou nutrição',
        amount: 1,
        used: 0,
        type: 'active',
      },
      {
        title: '20% de desconto em atendimentos',
        description: null,
        amount: null,
        used: null,
        type: 'passive',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('benefits', null, {});
  },
};
