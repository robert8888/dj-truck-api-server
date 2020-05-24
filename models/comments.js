'use strict';
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
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

        recordId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Record',
                key: 'id'
            }
        },
        text: DataTypes.STRING,
        time: DataTypes.FLOAT,

    }, {});

    Comment.associate = function (models) {
        // associations can be defined here

        Comment.belongsTo(models.User, {
            as : 'user',
            foreginKey: 'userId',
            onDelete: 'CASCADE',
        });

        Comment.belongsTo(models.Record, {
            as: 'record',
            foreginKey: 'recordId',
            targetKey: 'id',
            onDelete: 'CASCADE',
        })

    };
    return Comment;
};