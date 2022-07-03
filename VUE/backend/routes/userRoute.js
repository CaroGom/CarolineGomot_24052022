//Import du contenu extérieur : modules et fichiers
const express = require('express');
const auth = require('../middlewares/auth');
const userCtrl = require('../controllers/userCtrl')

//Création du router Express
const router = express.Router();

//Définition des routes router.${methode}(${chemin}, ${middleware1}, ${middleware2}, ..., ${controlleur})
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
//router.delete('/delete', auth, userCtrl.delete);

module.exports = router;