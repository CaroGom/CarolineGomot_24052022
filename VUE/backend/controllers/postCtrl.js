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
        image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        posterId: req.body.posterId,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        comments: [],
      });
      //saving Sauce posted with promise to get out of expired request = status of request registered in json files
      post.save()
        .then(() => res.status(201).json({message : 'post enregistré !'}))
        .catch(error => res.status(400).json({ error }));
  };

  //exporting function that selects one sauce
  exports.getOnePost = (req, res, next) => {
    Post.findOne({_id: req.params.id})
      .then(post => res.status(200).json(post))
      .catch(error => res.status(404).json({ error }));
  };

  //exporting function that gets all sauces
  exports.getAllPosts = (req, res, next) => {
    Post.find()
      .then(posts => res.status(200).json(posts))
      .catch(error => res.status(400).json({ error }));
  }

  //exporting function that modifies a sauce
  exports.modifyPost = (req, res, next) => {
    //setting up multer conditions on whether an image exists or not
    const postObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } : { ...req.body };
     Post.findOne({_id: req.params.id})
      .then((post) => {
        //verifying if the correct user is modifying
        if (post.userId !== req.auth.userId) {
          return res.status(403).json({ error : "Unauthorized request"});
        }
        //taking the new info from the request body of the sauce and updating it
        Post.updateOne({_id : req.params.id}, {...postObject, _id : req.params.id})
          .then(() => {
            res.status(201).json({ message : 'Objet modifié !'})
          })
          .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(404).json({ error }));
  };

  //exports function that deletes a sauce
  exports.deletePost = (req, res, next) =>{
    Post.findOne({_id: req.params.id})
      .then(post => {
        //gives an array of two elements, one is all that is before /images/ in url, one is what is after = filename
        const filename = post.image.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({_id : req.params.id})
          .then(() => res.status(200).json({ message : 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }))
        })
      })
      .catch(error => res.status(500).json({ error }))
    //verifying the user ID matches so not everyone can delete a sauce
    Post.findOne({_id :req.params.id}).then(
      (post) =>{
        if(!post){
          return res.status(404).json({
            error: new Error('Sauce non trouvée')})
        }
        if(post.userId !== req.auth.userId){
          return res.status(401).json({
            error: new Error('Requête non autorisée')
          })
        }

      }
    )

  }

//exports like and dislike function

exports.likePost = (req, res, next) => {
  switch (req.body.like) {
    //if a user disliked a sauce = putting the count at -1
    case -1 :
      Post.findOne({_id: req.params.id})
      .then( post => {
        //did they already dislike it
        if (post.usersDisliked.includes(req.body.userId)){
          res.status(208).json({error : 'Post already disliked'})
        } 
        //did they already like it
        else if (post.usersLiked.includes(req.body.userId)){
          res.status(208).json({error : 'Post cannot be liked and disliked at the same time'})
        } 
        //if not, dislike the sauce
        else {
          Post.updateOne(
            {_id: req.params.id},
            {
              $inc: {dislikes: 1},
              $push: {usersDisliked: req.body.userId},
            }
            )
            .then (() => res.status(200).json({message : "Post disliked !"}))
            .catch(error => res.status(400).json({error}))
          }
        })
      .catch(error => res.status(404).json({error}))
    break;

    //accessing the sauce having liked it or disliked it = putting the count back to zero
    case 0: 
      Post.findOne({_id: req.params.id})
      .then (post => {
        if (post.usersLiked.includes(req.body.userId)){
          //if sauce was liked, no longer liking it
          Post.updateOne(
            {_id: req.params.id},
            {
              $inc: {likes: -1},
              $pull: {usersLiked: req.body.userId},
            }
          )
            .then(() => res.status(200).json({message : "Post no longer liked !"}))
            .catch(error => res.status(400).json({error}))
          //if sauce was disliked, no longer disliking it
        } else if (post.usersDisliked.includes(req.body.userId)){
          Post.updateOne(
            {_id: req.params.id},
            {
              $inc: {dislikes: -1},
              $pull: {usersDisliked: req.body.userId},
            }
          )
            .then(() => res.status(200).json({message : "Post no longer disliked !"}))
            .catch(error => res.status(400).json({error}))
        }

      })
      .catch(error => res.status(404).json({error}))
    break;
  //if a user likes a sauce = putting the count to 1
  case 1:  Post.findOne({_id: req.params.id})
  .then( post => {
    //did they already like it
    if (post.usersLiked.includes(req.body.userId)){
      res.status(208).json({error : 'Sauce already liked'})
    } 
    //did they already like it
    else if (post.usersDisliked.includes(req.body.userId)){
      res.status(208).json({error : 'Sauce cannot be liked and disliked at the same time'})
    } 
    //if not, like the sauce
    else {
      Post.updateOne(
        {_id: req.params.id},
        {
          $inc: {likes: 1},
          $push: {usersLiked: req.body.userId},
        }
        )
        .then (() => res.status(200).json({message : "post liked !"}))
        .catch(error => res.status(400).json({error}))
      }
    })
  .catch(error => res.status(404).json({error}))
break;
  }
}