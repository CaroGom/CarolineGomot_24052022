const DataTypes = require('sequelize');
const db = require('../database/db');
const Like = require("./like");

const Post = db.define('post', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey : true,
        autoIncrement: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    timeDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
},
{
    timestamps: false,
});

Post.hasMany(Like, {onDelete: 'CASCADE'});

module.exports = Post;