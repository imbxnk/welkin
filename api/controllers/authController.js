const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorhandler');
const sendToken = require('../utils/jwt');
const sendEmail = require('../utils/send_email');
const crypto = require('crypto');


// Create Admin User (Only when there's no admin) [Username : admin will automatically assigned]
exports.createAdmin = catchAsyncErrors( async (req, res, next) => {
    req.body.username = 'admin'

    // Check whether there is an admin user in the Databse
    let user = await User.find({ group: 'admin' });
    
    if(user.length > 0) {
        return next(new ErrorHandler('Admin user already exists.', 400));
    }

    // Create Admin
    user = await User.create(req.body);
    sendToken(user, 200, res, 'Admin account has been created.');
})

// Create a new user => /v1/user/create
exports.createUser = catchAsyncErrors( async (req, res, next) => {
    const {first_name, last_name} = req.body;

    if(req.body.group === 'admin') {
        return next(new ErrorHandler('Admin user cannot be created.', 400));
    }

    // Automatically create Username according to firstname.las
    let firstname = first_name.trim() + '.';    
    let lastname = last_name.trim();
    req.body.username = firstname + lastname.substring(0,3);
    // If Lastname has more than or equal to 3 characters
    if(lastname.length >= 3) {
        // Check if the username exists
        let user = await User.findOne({username: req.body.username});
        // If exist use => firstname.lat instead
        while(user && lastname.length > 3) {
            lastname = lastname.slice(0,2) + lastname.slice(3);
            req.body.username = firstname + lastname.substring(0,3);
            user = await User.findOne({username: req.body.username});
        }
    }

    // Create User
    const user = await User.create(req.body);
    sendToken(user, 200, res, 'User has been created.');
});

// Login => /v1/login
exports.loginUser = catchAsyncErrors( async (req, res, next) => {
    const { username, password } = req.body;
    
    // Check if username / password is empty
    if(!username || !password) {
        return next(new ErrorHandler('Please enter username and password.', 400));
    }

    // Authentication
    // Get User from Database
    const user = await User.findOne({username}).select('+password');
    if(!user) {
        return next(new ErrorHandler('Invalid Username or Password', 401));
    }
    // Check Password
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Username or Password', 401));
    }

    sendToken(user, 200, res, 'Login successful.');
});

// Forgot Password => /v1/password/reset
exports.requestPasswordRecovery = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findOne({email : req.body.email});

    // Check user email in database
    if(!user) {
        return next(new ErrorHandler('Email not found in database.', 404));
    }
    
    // Get Reset Token and Save
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave : false });

    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/v1/password/reset/${resetToken}`;
    const message = `Your password reset link: ${resetUrl}\n\n
    The reset password link will expire in 30 minutes.\n
    Ps. Do not reply to this email.`;
    
    try {
        await sendEmail({
            email : user.email,
            subject : 'Welkin Password Recovery',
            message
        });
    
        res.status(200).json({
            success : true,
            message : `Password Recovery URL has been sent to ${user.email}`
        });
    } catch (error) {
        // If email cannot be sent, remove token
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave : false });
        return next(new ErrorHandler('Password Recovery has not been sent.', 500));
    }
});

// Reset Password => /vi/password/reset/:token
exports.resetPassword = catchAsyncErrors( async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt : Date.now()}
    });

    if(!user) {
        return next(new ErrorHandler('Password Reset token is invalid or has been expired.', 400));
    }

    // Set up new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
});