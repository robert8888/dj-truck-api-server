'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tracks', {
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
      playlist:{
        type: Sequelize.INTEGER,
        allowNull:true,
        onDelete: 'CASCADE',
        references:{
          model: 'Playlists', 
          key : 'id'
        }
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sourceId:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      quality:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      duration:{
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      bpm :{
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      offset:{
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      thumbnails:{
        type: Sequelize.JSON,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      position:{
        type: Sequelize.INTEGER
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tracks');
  }
};
