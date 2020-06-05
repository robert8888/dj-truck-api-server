'use strict';
module.exports = (sequelize, DataTypes) => {
    const RecordTrack = sequelize.define('RecordTracks', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        recordId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Record',
                key: "id"
            }
        },

        trackId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Track',
                key: "id"
            }
        },
        
        start : {
            type: DataTypes.FLOAT,
        },

        end : {
            type: DataTypes.FLOAT,
        }

    }, {});

    RecordTrack.associate = function (models) {
        // associations can be defined here

        RecordTrack.belongsTo(models.Track, {
            foreignKey: 'trackId',
            as: 'track'
        })

        RecordTrack.belongsTo(models.Record, {
            foreignKey: 'recordId',
            as : 'record',
            onDelete: 'CASCADE',
        })

    };
    return RecordTrack;
};