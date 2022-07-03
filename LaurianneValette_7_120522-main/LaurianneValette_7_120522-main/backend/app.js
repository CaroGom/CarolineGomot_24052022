//Import du contenu extérieur : modules et fichiers
const express = require('express');
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
const likeRoutes = require('./routes/like');
const path = require('path');
const db = require('./database/db');

//Création de l'application Express
const app = express();

//Accès à la base de données
db.sync({ alter: true })
    .then(console.log('Connexion à la base de donnée'))
    .catch(error => console.log(error))

//Extraction du corps des requêtes en JSON
app.use(express.json());

//Paramétrage des headers des requêtes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //Accès à l'API depuis toutes les origines *
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //Ajout de headers mentionnés aux requêtes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //Définition des méthodes autorisées
    next();
});

//Gestion des images de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

//Enregistrement des routers posts et user
app.use('/api/post', postRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/like', likeRoutes);

//Export de l'application
module.exports = app;
