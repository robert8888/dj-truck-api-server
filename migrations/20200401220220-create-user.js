'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      authId : {
        type: Sequelize.STRING,
        unique : true,
      }, 
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      emailVerified:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      password: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      givenName: {
        type: Sequelize.STRING
      },
      familyName:{
        type: Sequelize.STRING
      },
      nickname:{
        type: Sequelize.STRING
      },
      picture:{
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Users');
  }
};