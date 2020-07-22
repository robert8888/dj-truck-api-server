'use strict';
module.exports = (sequelize, DataTypes) => {
    const ControlProfile = sequelize.define('ControlProfile', {
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
        name: DataTypes.STRING,
        type: DataTypes.STRING,
    }, {});

    ControlProfile.associate = function (models) {
        // associations can be defined here

        ControlProfile.belongsTo(models.User, {
            foreignKey: 'userId',
            targetKey: 'id',
            onDelete: 'CASCADE',
            as: "user",
        })

        ControlProfile.hasMany(models.ControlProfileItem, {
            foreignKey: 'controlProfileId',
            sourceKey: 'id',
            as: 'map'
        })
    };
    return ControlProfile;
};