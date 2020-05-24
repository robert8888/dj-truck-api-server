'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RecordTracks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },

      recordId : {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Records',
          key: 'id'
        }
      },

      trackId : {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tracks',
          key: 'id'
        }
      },
      
      start : {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      end : {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('RecordTracks');
  }
};
