/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('benefits_notes', [
      {
        description: 'teste1',
        assignment_benefit_id: 1,
        created_at: '2023-09-09',
        updated_at: '2023-09-09',
      },
      {
        description: 'teste2',
        assignment_benefit_id: 2,
        created_at: '2023-09-09',
        updated_at: '2023-09-09',
      },
      {
        description: 'teste2',
        assignment_benefit_id: 2,
        created_at: '2023-09-09',
        updated_at: '2023-09-09',
      },
      {
        description: 'teste3',
        assignment_benefit_id: 3,
        created_at: '2023-09-09',
        updated_at: '2023-09-09',
      },
      {
        description: 'teste3',
        assignment_benefit_id: 3,
        created_at: '2023-09-09',
        updated_at: '2023-09-09',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('benefits_notes', null, {});
  },
};
