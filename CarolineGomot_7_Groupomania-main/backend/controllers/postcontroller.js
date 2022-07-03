const Post = require('../models/postmodel');

const User = require('../models/usermodel');
const { uploadErrors } = require('../utils/errors.utils');
const ObjectID = require('mongoose').Types.ObjectId;
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

exports.readPost = (req, res) => {
    Post.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Failed to get data : ' + err)
    }).sort({ createdAt: -1 });
};

exports.createPost = async (req, res) => {
    console.log(req.body.posterId)
     

    const newPost = new Post({
    
        image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        posterId: req.body.posterId,
        likers: [],
        comments: [],


    })
    /*let fileName;

    if (req.file !== null) {
        try{
            if(
                req.file.detectedMimeType !== "image/jpg" &&
                req.file.detectedMimeType !== "image/png" &&
                req.file.detectedMimeType !== "image/jpeg" 
                 
            )

                throw Error("invalid file");

            if (req.file.size > 500000) throw Error("max size");
        } catch(err) {
            const errors = uploadErrors(err);
            return res.status(201).json({ errors });
        }

        fileName = req.body.posterId + Date.now() + '.jpg';
        console.log(fileName)

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${_dirname}/../client/public/uploads/posts/${filename}`
            )
        )
    }

    const newPost = new Post(
        {
            posterId: req.body.posterId,
            message: req.body.message,
            picture: req.file !== null ? "./uploads/posts/" + fileName : "",
            likers: [],
            comments: [],
        });
*/
    try {
        const post = await newPost.save();
        return res.status(201).json(post);

    } catch (err) {
        return res.status(400).send(err);
    }
};

exports.updatePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id)
    const updatedRecord = {
        message: req.body.message
    }
    Post.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log("Update error : " + err);
        }
    )
};

exports.deletePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id)
    Post.findByIdAndDelete(
        req.params.id,
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log("Deletion error : " + err);
        }
    )
};

exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    try {
        await Post.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likers: req.body.id }
            },
            { new: true },
            /*(err, docs) => {
                if (err) return res.status(400).send(err);
            }*/
        );
        await User.findByIdAndUpdate(
            req.body.id,
            {
                $addToSet: { likes: req.params.id }
            },
            { new: true },
            /*(err, docs) => {
                if (!err) res.send(docs);
                else return res.status(400).send(err);
            }*/
        )
        .then((docs) => res.send(docs))
        .catch((err) => res.status(500).send({ message : err }));
    } catch (err) {
        return res.status(500).json({message : err});
    }
};

exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    try {
        await Post.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likers: req.body.id }
            },
            { new: true },
            /*(err, docs) => {
                if (err) return res.status(400).send(err);
            }*/
        );
        await User.findByIdAndUpdate(
            req.body.id,
            {
                $pull: { likes: req.params.id }
            },
            { new: true },
            /*(err, docs) => {
                if (!err) res.send(docs);
                else return res.status(400).send(err);
            }*/
        )
        .then((docs) => res.send(docs))
        .catch((err) => res.status(500).send({ message : err }));
    } catch (err) {
        return res.status(500).json({message : err});
    }
};

exports.commentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);
    try {
        return Post.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterEmail: req.body.commenterEmail,
                        text: req.body.text,
                        timestamp: new Date().getTime()
                    }
                }
            },
            { new: true },
            
        )
        .then((docs) => res.send(docs))
        .catch((err) => res.status(400).send({ message : err }));
    } catch (err){
        return res.status(400).json({message : err});
    }
};

exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {

        return Post.findById(req.params.id, (err, docs) => {
            const theComment = docs.comments.find((comment) => 
                comment._id.equals(req.body.commentId)
            );
           
            
            if (!theComment) return res.status(404).send('Comment not found');
            theComment.text = req.body.text;

            return docs.save((err) =>{
                if(!err) return res.status(200).send(docs);
                return res.status(500).send(err);
            }
            );
            }
        );
    } catch (err){
        return res.status(400).json({message : err});
    }
}

exports.deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

    try{
        return Post.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    }
                }
            },
            { new: true }
        )
        .then((docs) => res.send(docs))
        .catch((err) => res.status(400).send({ message : err }));
    } catch (err){
        return res.status(400).json({message : err});
    }
   
}

