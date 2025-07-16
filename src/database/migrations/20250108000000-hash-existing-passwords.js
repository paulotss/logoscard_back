const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get all users with plain text passwords
    const users = await queryInterface.sequelize.query(
      'SELECT id, password FROM users',
      { type: Sequelize.QueryTypes.SELECT },
    );

    // Hash each password and update the user
    const updatePromises = users
      .filter(user => user.password && user.password.length < 60) // bcrypt hashes are 60 chars
      .map(async user => {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        return queryInterface.sequelize.query(
          'UPDATE users SET password = ? WHERE id = ?',
          {
            replacements: [hashedPassword, user.id],
            type: Sequelize.QueryTypes.UPDATE,
          },
        );
      });

    await Promise.all(updatePromises);

    console.log(`✅ Hashed passwords for ${users.length} users`);
  },

  async down(queryInterface, Sequelize) {
    // This migration is not reversible for security reasons
    // You cannot unhash passwords
    console.log(
      '⚠️  This migration cannot be reversed - passwords remain hashed',
    );
  },
};
