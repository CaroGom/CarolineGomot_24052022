//Import du contenu extérieur : modules et fichiers
const express = require('express');
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Création du router Express
const router = express.Router();

//Définition des routes router.${methode}(${chemin}, ${middleware1}, ${middleware2}, ..., ${controlleur})
router.post('/', auth, multer, postCtrl.createPost);
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);
router.get('/user/:userId', auth, postCtrl.getUserPosts);

//Export du routeur
module.exports = router;