'use strict';
module.exports = (sequelize, DataTypes) => {
  const Track = sequelize.define('Track', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references:{
          model: 'User',
          key: "id"
        }
      },
    playlist:{
        type: DataTypes.INTEGER,
        references:{
            model: "Playlist",
            key: "id"
        }
    },
    title: DataTypes.STRING,
    source: DataTypes.STRING,
    sourceId: DataTypes.STRING,
    quality: DataTypes.STRING,
    duration: DataTypes.DOUBLE,
    bpm: DataTypes.DOUBLE,
    offset: DataTypes.DOUBLE,
    thumbnails: DataTypes.JSON,
    
    position: DataTypes.INTEGER

  }, {});
  Track.associate = function(models) {
    // associations can be defined here
    Track.belongsTo(models.User, { 
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    }),
    Track.belongsTo(models.Playlist, {
      foreignKey: "playlist",
      onDelete: 'CASCADE',
    })
  };
  return Track;
};