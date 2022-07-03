//Import du contenu extérieur : modules et fichiers
const Like = require('../models/like');

//Compteur de likes
exports.getLikes = (req, res) => {
    let idParams = parseInt(req.params.id)
    Like.findAndCountAll({ where: {postId : idParams, value : 1 }})
        .then(likes => {
            res.status(200).json(likes)
        })
        .catch(error => res.status(400).json({error}));
};

//Compteur de dislikes
exports.getDislikes = (req, res) => {
    let idParams = parseInt(req.params.id)
    Like.findAndCountAll({ where: {postId : idParams, value : -1 }})
        .then(dislikes => {
            res.status(200).json(dislikes)
        })
        .catch(error => res.status(400).json({error}));
};

//Ajout ou suppression de like ou dislike
exports.createLike = (req, res) => {
    Like.findOne({where: {postId: req.params.id, userId: req.auth.userId}})
        .then(like => {
            if (!like) {
                const like = new Like({
                    userId: req.auth.userId,
                    postId: parseInt(req.params.id),
                    value: parseInt(req.body.value),
                })
                like.save()
                    .then(() => res.status(201).json({like}))
                    .catch(error => res.status(400).json({error}));
            } else {
                const likeObject = {
                    userId: req.auth.userId,
                    postId: parseInt(req.params.id),
                }
                if (parseInt(req.body.value) === -1) {
                    if (like.value === -1) {
                        likeObject.value = 0
                    } else {
                        likeObject.value = -1
                    }
                }
                if (parseInt(req.body.value) === 1) {
                    if (like.value === 1) {
                        likeObject.value = 0
                    } else {
                        likeObject.value = 1
                    }
                }
                like.update(likeObject)
                    .then(() => {
                        like.save()
                            .then(() => res.status(201).json({like}))
                            .catch(error => res.status(400).json({error}));
                    })
                    .catch(error => res.status(400).json({error: 'Like not updated.'}));
            }
        })
        .catch(error => res.status(404).json({error: 'Like not found.'}));
}