/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('card_tokens', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      token: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(64),
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_by: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      expires_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      is_used: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      used_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        ),
      },
    });

    // Add indexes for performance
    await queryInterface.addIndex('card_tokens', ['token'], {
      name: 'idx_card_tokens_token',
    });

    await queryInterface.addIndex('card_tokens', ['user_id'], {
      name: 'idx_card_tokens_user_id',
    });

    await queryInterface.addIndex('card_tokens', ['expires_at'], {
      name: 'idx_card_tokens_expires_at',
    });

    await queryInterface.addIndex('card_tokens', ['is_used'], {
      name: 'idx_card_tokens_is_used',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('card_tokens');
  },
};
