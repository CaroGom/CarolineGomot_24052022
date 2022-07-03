const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        email: {
            type : String,
            required : true, 
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true,
        },
        password: {
            type : String, 
            required : true,
            minlength : 6,
            max: 1024,
        },
        likes: {
            type: [String],
        }
    },
    {
        timestamps: true,
    }
)

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);