'use strict';
module.exports = (sequelize, DataTypes) => {
    const ControlProfileItem = sequelize.define('ControlProfileItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        controlProfileId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ControlProfile',
                key: "id"
            }
        },
        key: DataTypes.STRING,
        value: DataTypes.STRING,
    }, {});

    ControlProfileItem.associate = function (models) {
        // associations can be defined here

        ControlProfileItem.belongsTo(models.ControlProfile, {
            foreignKey: 'controlProfileId',
            targetKey: 'id',
            onDelete: "CASCADE",
            as: "map"
        })
    };
    return ControlProfileItem;
};