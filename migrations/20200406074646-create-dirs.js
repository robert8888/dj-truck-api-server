'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Dirs', {
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
      root:{
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue: false,
      },
      parrent:{
        type: Sequelize.INTEGER,
        allowNull:true,
        onDelete: 'CASCADE',
        references:{
          model: 'Dirs', 
          key : 'id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Dirs');
  }
};
