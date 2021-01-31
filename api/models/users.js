const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

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
                'lecturer',
                'admin'
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


// Return JSON Web Token
userSchema.methods.getJwtToken = function() {
    return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_TIME
    });
}

// Compare user password in database password
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', userSchema);