'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Records', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },

      userId : {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      },

      title: {
        type: Sequelize.STRING, 
        allowNull: false
      },

      description:{
        type: Sequelize.STRING, 
        allowNull: true,
      },

      duration: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },

      fileSize:{
        type: Sequelize.STRING,
        allowNull: true,
      },

      peaks: {
        type: Sequelize.ARRAY(Sequelize.FLOAT),
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Records');
  }
};
