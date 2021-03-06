'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    nickname: DataTypes.STRING,
    givenName: DataTypes.STRING,
    familyName: DataTypes.STRING,
    picture: DataTypes.STRING,

  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasOne(models.UserMeta, {
      foreginKey: "userId",
      sourceKey: "id",
      as: "user"
    })
  };
  return User;
};