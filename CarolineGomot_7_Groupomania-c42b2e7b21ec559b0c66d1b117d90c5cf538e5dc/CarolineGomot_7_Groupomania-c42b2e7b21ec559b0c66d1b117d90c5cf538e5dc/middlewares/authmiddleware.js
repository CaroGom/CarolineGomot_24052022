const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('../models/usermodel');


module.exports.checkUser = (req, res, next) => {
    try{
        //return array with bearer as first element and token as second element
        const token = req.cookies.jwt;
       
        if (token){
            jwt.verify(token, process.env.RANDOM_TOKEN_SECRET, async(err, decodedToken) => {
                if (err) {
                    res.locals.user = null;
                    res.cookie('jwt', '', {maxAge: 1 });
                    next();
                } else{
                    let user = await User.findById(decodedToken.id);
                    res.locals.user = user;
                    console.log(res.locals.user);
                    next();
                }
            })
        }
        else{
            res.locals.users = null;
            next();
        }
    } catch(error) {
        res.status(401).json({error: error | "Problème d'authentification !"})
    }
}

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, process.env.RANDOM_TOKEN_SECRET, async(err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {
                console.log(decodedToken.id);
                next();
            }
        });
    } else {
        console.log('No token');
    }
};