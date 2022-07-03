const DataTypes = require('sequelize');
const db = require('../database/db');
const Post = require('./post');
const Like = require('./like');

const User = db.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { is: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
},
{ timestamps: false,}
);

Post.belongsTo(User, {onDelete: 'CASCADE'});
User.hasMany(Like, {onDelete: 'CASCADE'});

module.exports = User;