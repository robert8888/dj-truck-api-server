'use strict';
module.exports = (sequelize, DataTypes) => {
    const FavoriteRecord = sequelize.define('FavoriteRecord', {

        recordId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Record',
                key: "id"
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: "id"
            }
        },

    }, {});

    FavoriteRecord.associate = function (models) {
        // associations can be defined here

        FavoriteRecord.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        })

        FavoriteRecord.belongsTo(models.Record, {
            foreignKey: 'recordId',
            onDelete: 'CASCADE'
        })

    };
    return FavoriteRecord;
};