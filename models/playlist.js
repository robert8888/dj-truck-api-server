module.exports = (sequelize, DataTypes) => {
    const Playlist = sequelize.define('Playlist', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },
      userId: {
        type: DataTypes.INTEGER,
        references:{
          model: 'User',
          key: "id"
        }
      },
      dir:{
        type: DataTypes.INTEGER,
        references:{
          model: "Dir",
          key: "id"
        }
      },
      name: DataTypes.STRING
    }, {});
    Playlist.associate = function(models) {
      // associations can be defined here
      Playlist.belongsTo(models.User, { 
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      })
      Playlist.belongsTo(models.Dir, {
        foreignKey: 'dir',
        onDelete: 'CASCADE',
      })
    };
    return Playlist;
  };