/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('benefits', [
      {
        title: 'Teleatendimento médico',
        description:
          'Psicologia, massoterapia, clínica média, acupuntura ou nutrição',
        type: 'active',
        amount: 1,
        plan_id: 1,
      },
      {
        title: 'Consulta em especialidades',
        description:
          'Psicologia, massoterapia, clínica média, acupuntura ou nutrição',
        type: 'active',
        amount: 1,
        plan_id: 1,
      },
      {
        title: '20% de desconto em atendimentos',
        description: null,
        type: 'passive',
        amount: null,
        plan_id: 1,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('benefits', null, {});
  },
};
