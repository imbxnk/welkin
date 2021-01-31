const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        lowercase : true,
        unique : [true, 'This username is already existed.']
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    first_name : {
        type : String,
        required : [true, 'Please enter the first name.']
    },
    middle_name : {
        type : String
    },
    last_name : {
        type : String,
        required : [true, 'Please enter the last name.']
    },
    email : {
        type : String,
        required : [true, 'Please enter the email address.'],
        unique : [true, 'This email is already existed.'],
        validate : [validator.isEmail, 'Please enter a valid email address.']
    },
    group: {
        type : String,
        enum : {
            values : [
                'coordinator',
                'program director',
                'lecturer'
            ],
            message : 'Please select correct group type.'
        },
        default : 'lecturer'
    },
    isAdvisor : {
        type : Boolean,
        default : false
    },
    avatar_url : {
        type : String
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date
});

// Hashing Password
userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10)
});

module.exports = mongoose.model('User', userSchema);