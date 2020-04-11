'use strict';


module.exports = (sequelize, DataTypes) => {
  const Dir = sequelize.define('Dir', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references:{
        model: 'User',
        key: "id"
      }
    },
    root: DataTypes.BOOLEAN,
    parrent:{
      type: DataTypes.INTEGER,
      references:{
        model: "Dir",
        key: "id"
      }
    },
    name: DataTypes.STRING
  }, {});
  Dir.associate = function(models) {
    // associations can be defined here

    Dir.belongsTo(models.User, { 
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Dir.belongsTo(models.Dir, { 
      foreignKey: 'parrent',
      onDelete: "CASCADE" 
    })
  };
  return Dir;
};