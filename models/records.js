'use strict';
module.exports = (sequelize, DataTypes) => {
    const Record = sequelize.define('Record', {
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

        title: DataTypes.STRING,
        description: DataTypes.STRING,
        duration: DataTypes.DOUBLE,
        fileSize: DataTypes.STRING,
        peaks: DataTypes.ARRAY(DataTypes.FLOAT),
        createdAt: {
            type: DataTypes.DATE,
        },
    }, {});

    Record.associate = function (models) {
        // associations can be defined here

        Record.belongsToMany(models.Genre, {
            foreignKey: 'recId',
            as: 'genres',
            through: { model: models.RecordGenres }
        })

        Record.belongsToMany(models.Track, {
            foreignKey: 'recordId',
            as: 'tracks',
            otherKey: 'trackId',
            through: { model: models.RecordTracks }
        })

        Record.hasMany(models.Comment, {
            foreignKey: 'recordId',
            sourceKey: 'id',
            as: 'comments'
        })

        Record.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        })

        Record.belongsToMany(models.User, {
            as: 'favorited',
            foreignKey: 'recordId',
            otherKey: 'userId',
            through: {model: models.FavoriteRecord}
        })

    };
    return Record;
};