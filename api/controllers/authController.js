const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorhandler');
const sendToken = require('../utils/jwt');

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