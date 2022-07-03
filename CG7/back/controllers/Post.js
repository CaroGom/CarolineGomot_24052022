const Post = require('../models/postModel');
const fs = require('fs');


//exporting function that creates sauce
exports.createPost = (req, res, next) => {
      //handling multer body change with object
      const postObject = JSON.parse(req.body.sauce);
      //deleting from object MongoDB assigned ID for post
      //delete sauceObject._id;
      //new Sauce that requests the body of the post with spread function ...
      const post = new Post({
        ...postObject,
        //setting the img url using path that leads to images with their automatically generated name
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
      });
      //saving Sauce posted with promise to get out of expired request = status of request registered in json files
      post.save()
        .then(() => res.status(201).json({message : 'Post enregistré !'}))
        .catch(error => res.status(400).json({ error }));
  };

  //exporting function that selects one sauce
  exports.getOnePost = (req, res, next) => {
    Post.findOne({_id: req.params.id})
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };

  //exporting function that gets all sauces
  exports.getAllPosts = (req, res, next) => {
    Post.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  }

  //exporting function that modifies a sauce
  exports.modifyPost = (req, res, next) => {
    //setting up multer conditions on whether an image exists or not
    const postObject = req.file ?
    {
      ...JSON.parse(req.body.post),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } : { ...req.body };
     Post.findOne({_id: req.params.id})
      .then((post) => {
        //verifying if the correct user is modifying
        if (sauce.userId !== req.auth.userId) {
          return res.status(403).json({ error : "Unauthorized request"});
        }
        //taking the new info from the request body of the sauce and updating it
        Sauce.updateOne({_id : req.params.id}, {...sauceObject, _id : req.params.id})
          .then(() => {
            res.status(201).json({ message : 'Objet modifié !'})
          })
          .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(404).json({ error }));
  };

  //exports function that deletes a sauce
  exports.deleteSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
      .then(sauce => {
        //gives an array of two elements, one is all that is before /images/ in url, one is what is after = filename
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({_id : req.params.id})
          .then(() => res.status(200).json({ message : 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }))
        })
      })
      .catch(error => res.status(500).json({ error }))
    //verifying the user ID matches so not everyone can delete a sauce
    Sauce.findOne({_id :req.params.id}).then(
      (sauce) =>{
        if(!sauce){
          return res.status(404).json({
            error: new Error('Sauce non trouvée')})
        }
        if(sauce.userId !== req.auth.userId){
          return res.status(401).json({
            error: new Error('Requête non autorisée')
          })
        }

      }
    )

  }

//exports like and dislike function

exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {
    //if a user disliked a sauce = putting the count at -1
    case -1 :
      Sauce.findOne({_id: req.params.id})
      .then( sauce => {
        //did they already dislike it
        if (sauce.usersDisliked.includes(req.body.userId)){
          res.status(208).json({error : 'Sauce already disliked'})
        } 
        //did they already like it
        else if (sauce.usersLiked.includes(req.body.userId)){
          res.status(208).json({error : 'Sauce cannot be liked and disliked at the same time'})
        } 
        //if not, dislike the sauce
        else {
          Sauce.updateOne(
            {_id: req.params.id},
            {
              $inc: {dislikes: 1},
              $push: {usersDisliked: req.body.userId},
            }
            )
            .then (() => res.status(200).json({message : "Sauce disliked !"}))
            .catch(error => res.status(400).json({error}))
          }
        })
      .catch(error => res.status(404).json({error}))
    break;

    //accessing the sauce having liked it or disliked it = putting the count back to zero
    case 0: 
      Sauce.findOne({_id: req.params.id})
      .then (sauce => {
        if (sauce.usersLiked.includes(req.body.userId)){
          //if sauce was liked, no longer liking it
          Sauce.updateOne(
            {_id: req.params.id},
            {
              $inc: {likes: -1},
              $pull: {usersLiked: req.body.userId},
            }
          )
            .then(() => res.status(200).json({message : "Sauce no longer liked !"}))
            .catch(error => res.status(400).json({error}))
          //if sauce was disliked, no longer disliking it
        } else if (sauce.usersDisliked.includes(req.body.userId)){
          Sauce.updateOne(
            {_id: req.params.id},
            {
              $inc: {dislikes: -1},
              $pull: {usersDisliked: req.body.userId},
            }
          )
            .then(() => res.status(200).json({message : "Sauce no longer disliked !"}))
            .catch(error => res.status(400).json({error}))
        }

      })
      .catch(error => res.status(404).json({error}))
    break;
  //if a user likes a sauce = putting the count to 1
  case 1:  Sauce.findOne({_id: req.params.id})
  .then( sauce => {
    //did they already like it
    if (sauce.usersLiked.includes(req.body.userId)){
      res.status(208).json({error : 'Sauce already liked'})
    } 
    //did they already like it
    else if (sauce.usersDisliked.includes(req.body.userId)){
      res.status(208).json({error : 'Sauce cannot be liked and disliked at the same time'})
    } 
    //if not, like the sauce
    else {
      Sauce.updateOne(
        {_id: req.params.id},
        {
          $inc: {likes: 1},
          $push: {usersLiked: req.body.userId},
        }
        )
        .then (() => res.status(200).json({message : "Sauce liked !"}))
        .catch(error => res.status(400).json({error}))
      }
    })
  .catch(error => res.status(404).json({error}))
break;
  }
}