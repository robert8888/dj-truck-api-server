'use strict';
module.exports = (sequelize, DataTypes) => {
    const Record = sequelize.define('RecordGeneres', {

        recId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Record',
                key: "id"
            }
        },
        genId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Genere',
                key: "id"
            }
        },

    }, {});

    Record.associate = function (models) {
        // associations can be defined here

        Record.belongsTo(models.Genere, {
            foreignKey: 'genId',
            onDelete: 'CASCADE'
        })

        Record.belongsTo(models.Record, {
            foreignKey: 'recId',
            onDelete: 'CASCADE'
        })

    };
    return Record;
};