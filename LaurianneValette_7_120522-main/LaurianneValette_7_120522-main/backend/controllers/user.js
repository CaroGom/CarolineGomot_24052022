
//Import du contenu extérieur : modules et fichiers
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const db = require('../database/db');

//Création d'un nouvel utilisateur
exports.signup = (req, res) => {
    //Création de la table des utilisateurs si elle n'existe pas déjà
    db.sync();
    //Hachage du mot de passe récupéré dans la requête
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            let user = new User({
                email: req.body.email,
                password: hash
            });
            User.findAll()
                .then(users => {
                    if (users.length === 0) {
                        user.admin = true;
                    }
                    //Enregistrement du nouvel utilisateur dans la BDD
                    user.save()
                        .then(() => res.status(201).json({
                            message: 'New user created !',
                        }))
                        .catch(error => res.status(400).json({error: 'User saving failed.'}));
                })
                .catch(error => res.status(404).json({error: 'Users not found.'}));
        })
        .catch(error => res.status(500).json({error: 'Password encryption failed.'}));
};

//Connection d'un utilisateur existant
exports.login = (req, res) => {
    //Accès à l'utilisateur avec l'email contenu dans le corps de la requête
    User.findOne({where: { email: req.body.email}})
        .then(user => {
            //Retourne une erreur si l'utilisateur n'existe pas
            if (!user) {
                return res.status(404).json({error: 'User not found.'});
            }
            //Comparaison du hash stocké dans la BDD et du mot de passe renseigné à la connexion
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    //Retourne une erreur si le mot de passe est incorrect
                    if(!valid) {
                        return res.status(403).json({error: 'Incorrect password!'});
                    }
                    //Retourne le userId et un token valable pendant 24h si le mot de passe est correct
                    res.status(200).json({
                        userId: user.id,
                        token: jwt.sign(
                            { userId: user.id},
                            'zGUx1pQEzNHcRbtuxUiq9nzEhAzSv5fE',
                            { expiresIn: '24h'}
                        ),
                        admin: user.admin
                    });
                })
                .catch(error => res.status(500).json({error: 'Password comparison failed.'}));
        })
        .catch(error => res.status(404).json({error: 'User not found.'}));
};

//Suppression d'un profil
exports.delete = (req, res) => {
    //Accès à l'utilisateur dans la  BDD
    const userIdInt = req.auth.userId
    User.findOne({where: {id: userIdInt}})
        .then(user => {
            //Empêche de supprimer le premier compte admin
            if (user.admin === true) {
                res.status(404).json({error: 'Unauthorized request.'});
            } else {
                //Suppression de l'utilisateur
                user.destroy()
                    .then(() => {
                        res.status(200).json({message: 'User deleted!'});
                    })
                    .catch(error => res.status(400).json({error: 'User removal failed.'}));
            }
        })
        .catch(error => res.status(404).json({error: 'User not found'}));
};

//Renvoi de l'état d'authentification
exports.authentication = (req, res) => {
    res.status(200).json({userId: req.auth.userId});
};