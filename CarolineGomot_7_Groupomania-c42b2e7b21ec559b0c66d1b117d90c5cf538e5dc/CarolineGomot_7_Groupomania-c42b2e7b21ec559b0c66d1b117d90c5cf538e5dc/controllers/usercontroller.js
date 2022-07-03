const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ObjectID = require('mongoose').Types.ObjectId;
const User = require('../models/usermodel');
const { signupErrors, signInErrors } = require('../utils/errors.utils');
const maxAge = 3*24*60*60*1000;
const createToken = (id) =>{
    return  jwt.sign(
        { id },
        process.env.RANDOM_TOKEN_SECRET,
        { expiresIn: maxAge}
    )
}


exports.getAllUsers = async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json(users);
}

exports.userInfo = (req, res) => {
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    User.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('ID unknown : ' + err);
    })
    .select('-password')
}

exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)
    try {
        await User.remove({_id: req.params.id}).exec();
        res.status(200).json({message : "User successfully deleted"});
    }
    catch(err) {
        return res.status(500).json({ message : err});
    }
}

/*exports.updateUser = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)
    try {
        await User.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set: {

                }
            }
        )
    }
}*/

//setting up signup function
//salted 10 times to create a user object with the email in the req body and a hashed password
exports.signup = async(req, res) => {
    const {email, password} = req.body;
    console.log(req.body);

    try{
        const user = await User.create({email, password});
        res.status(201).json({ user: user._id });
    }

    catch(err) {
        const errors = signupErrors(err);
        res.status(200).send({ errors })
    }

    
   /*bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash,
        })
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(errors => res.status(400).json({ errors }));
    })
    .catch(errors =>  res.status(500).json({ errors }))
*/
};


//setting up login function, bcrypt compares registered hash with req body password hashed
//assigning a token to the user upon successful connection for 24h
exports.signIn = async (req, res) => {
    
    const { email, password } = req.body
    console.log(req.body)
    

    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
         //JWT stored in cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge})
        res.status(200).json({ user: user._id })
    } catch (err){
        const errors = signInErrors(err);
        res.status(200).json({ errors });
    }

}
    /*User.findOne({email : req.body.email})
        .then(user => {
            if(!user){
                return res.status(401).json({message: 'Utilisateur non trouvé :(' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid =>{
                    if(!valid){
                        return res.status(401).json({message: 'Mot de passe incorrect :(' });
                    }
                    const token = createToken(user._id);
                    //JWT stored in cookie
                    res.cookie('jwt', token, { httpOnly: true, maxAge})
                    res.status(200).json({
                        userId: user._id,
                     });
                })
                .catch(error => res.status(500).json({ error }))
            })
        
        .catch(error => res.status(500).json({ error }))

};
*/

exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};

