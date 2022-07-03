const DataTypes = require('sequelize');
const db = require('../database/db');

const Like = db.define('like', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey : true,
        autoIncrement: true,
        allowNull: false,
    },
    value: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
    },
},
{
    timestamps: false,
});

module.exports = Like;