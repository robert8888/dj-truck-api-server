'use strict';


module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  }, {});
  Genre.associate = function(models) {
    // associations can be defined here

    Genre.belongsToMany(models.Record, { 
      foreignKey: 'genId',
      through: {model: models.RecordGenres}
    });

  };
  return Genre;
};