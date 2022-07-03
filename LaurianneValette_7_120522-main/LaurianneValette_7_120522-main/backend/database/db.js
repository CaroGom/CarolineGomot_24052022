//Import du contenu extérieur : modules et fichiers
const Sequelize = require("sequelize");

//Connection à la base de donnée
const db = new Sequelize(
    'groupomaniadb',
    'root' ,
    '####',
    {dialect: 'mysql',
        host: 'localhost'}
)

module.exports = db;