'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserMeta = sequelize.define('UserMeta', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: "id"
            }
        },

        description: DataTypes.STRING,
    }, {});

    UserMeta.associate = function (models) {
        // associations can be defined here

        UserMeta.belongsTo(models.User, {
            foreignKey: 'userId',
            targetKey: 'id',

        })


    };
    return UserMeta;
};