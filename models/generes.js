'use strict';


module.exports = (sequelize, DataTypes) => {
  const Genere = sequelize.define('Genere', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  }, {});
  Genere.associate = function(models) {
    // associations can be defined here

    Genere.belongsToMany(models.Record, { 
      foreignKey: 'genId',
      through: {model: models.RecordGeneres}
    });

  };
  return Genere;
};