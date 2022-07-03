const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        posterId: {
            type: String, 
            required: true
        },
        message : {
            type: String,
            trim : true, 
            maxlength: 500,
        },
        image: {
            type: String,
        },
        likes: { 
            type: Number, 
            required: true, 
            default: 0 
        },
        dislikes: { 
            type: Number,
             required: true, 
             default: 0 
            },
        usersLiked: {
            type: [String],
            required: false,
        },
        usersDisliked: {
            type: [String],
            required: false,
        },
        comments: {
            type: [
                {
                    commenterId: String, 
                    commenterEmail: String,
                    text: String,
                    timeStamp: Number,
                }
            ],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('post', PostSchema)
