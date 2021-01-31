const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : true
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
        unique : true,
        validate : [validator.isEmail, 'Please enter a valid email address']
    },
    group: {
        type : [String],
        enum : {
            values : [
                'coordinator',
                'program director',
                'advisor',
                'lecturer'
            ],
            message : 'Please select correct group type.'
        },
        default : 'lecturer'
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

userSchema.pre('save', function(next) {
    let username = this.first_name + '.';
    if(this.last_name.length >= 3) {
        username += this.last_name.substring(0,3);
    } else {
        username += this.last_name
    }    
    this.username = username;
    next();
});

exports.userSchema = mongoose.model('User', userSchema);