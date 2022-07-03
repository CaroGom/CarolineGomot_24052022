//Import du contenu extérieur : modules et fichiers
const Post = require('../models/post');
const User = require('../models/user');
const Like = require('../models/like');
const db = require('../database/db');
const fs = require('fs');


//Créer un nouveau post
exports.createPost = (req, res) => {
    //Récupération des informations du nouveau post dans le corps de la requête
    //Différenciation des cas avec ou sans image
    const postObject = req.file ?
        {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    //Création d'un nouvel objet sur le format du schéma Post
    const post = new Post({
        ...postObject,
        timeDate: Date.now(),
        userId: req.auth.userId
    });
    //Enregistrement du post dans la BDD
    post.save()
        .then(() => res.status(201).json({post}))
        .catch(error => res.status(400).json({error}));
}

//Récupérer tous les posts
exports.getAllPosts = (req, res) => {
    Post.findAll({order: [['timeDate', 'DESC']]})
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({error}));
};

//récupérer un post
exports.getOnePost = (req, res) => {
    let idParams = parseInt(req.params.id)
    Post.findOne({where: {id: idParams}})
        .then(post => res.status(200).json(post))
        .catch(error => res.status(400).json({error}));
};

//Récupérer tous les posts d'un utilisateur
exports.getUserPosts = (req, res) => {
    let idParams = parseInt(req.params.userId)
    Post.findAll({where: {userId: idParams}})
        .then(posts => {
            if (posts.length === 0) {
                res.status(200).json({message: 'This user doesn\'t exist or didn\'t post anything yet.'})
            } else {
                res.status(200).json(posts)
            }
        })
        .catch(error => res.status(400).json({error}));
};

//Modifier un post
exports.modifyPost = (req, res) => {
    //Création d'un nouvel objet postObject avec les informations contenues dans le corps de la requête
    //Différenciation des cas avec ou sans nouvelle image
    const postObject = req.file ?
        {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    //Accès au post avec l'id contenu dans les paramètres de la requête
    let postIdInt = parseInt(req.params.id)
    let userIdInt = req.auth.userId
    Post.findOne({where: {id: postIdInt}})
        .then((post) => {
            //Recherche du profil de l'utilisateur
            User.findOne({where: {id: userIdInt}})
                .then((user => {
                    //Vérification du droit de modification de l'utilisateur
                    if ((post.userId !== userIdInt) && (!user.admin))  {
                        return res.status(403).json({ error : "Unauthorized request."});
                    }
                    //Mise à jour du post
                    post.update(postObject)
                        .then(() => {
                            post.save()
                                .then(() => res.status(201).json({message: 'Post updated successfully!'}))
                                .catch(error => res.status(400).json({error}));
                        })
                        .catch(error => res.status(400).json({error: 'Post not updated.'}));
                }))
                .catch(error => res.status(404).json({error: 'User not found.'}));
        })
        .catch(error => res.status(404).json({error: 'Post not found.'}));
};

//Supprimer un post
exports.deletePost = (req, res) => {
    //Accès au post avec l'id contenu dans les paramètres de la requête
    let postIdInt = parseInt(req.params.id)
    let userIdInt = req.auth.userId
    Post.findOne({where: {id: postIdInt}})
        .then(post => {
            //Accès à l'utilisateur dans la  BDD
            User.findOne({where: {id: userIdInt}})
                .then((user => {
                    //Vérification du droit de modification de l'utilisateur
                    if ((post.userId !== userIdInt) && (!user.admin))  {
                        return res.status(403).json({ error : "Unauthorized request."});
                    }
                    //Récupération du nom du fichier image
                    let filename
                    if (post.imageUrl) {
                        filename = post.imageUrl.split('/images/')[1];
                    } else {
                         filename=''
                    }
                    //Suppression du fichier image
                    fs.unlink(`images/${filename}`, () => {
                        //Suppression du post dans la BDD
                        console.log('ok')
                        post.destroy()
                            .then(() => {
                                return res.status(200).json({message: 'Post deleted!'});
                            })
                            .catch(error => res.status(400).json({error: 'Post not deleted.'}))
                    })
                }))
                .catch(error => res.status(404).json({error: 'User not found.'}));
        })
        .catch(error => res.status(404).json({error: 'Post not found.'}));
};