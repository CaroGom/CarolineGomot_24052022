//Import du contenu extérieur : modules et fichiers
const express = require('express');
const likeCtrl = require('../controllers/like');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Création du router Express
const router = express.Router();

//Définition des routes router.${methode}(${chemin}, ${middleware1}, ${middleware2}, ..., ${controlleur})
router.post('/:id', auth, likeCtrl.createLike); //:id est l'id du post liké
router.get('/:id', auth, likeCtrl.getLikes);
router.get('/d/:id', auth, likeCtrl.getDislikes);

//Export du routeur
module.exports = router;