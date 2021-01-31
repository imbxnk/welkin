const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncError');

// Create a new user => /v1/user/create
exports.createUser = catchAsyncErrors( async (req, res, next) => {
    const {password, first_name, middle_name, last_name, email, group, isAdvisor} = req.body;

    // Automatically create Username according to firstname.las
    let firstname = first_name.trim() + '.';    
    let lastname = last_name.trim();
    let username = firstname + lastname.substring(0,3);
    // If Lastname has more than or equal to 3 characters
    if(lastname.length >= 3) {
        // Check if the username exists
        let user = await User.findOne({username: username});
        // If exist use => firstname.lat instead
        while(user && lastname.length > 3) {
            lastname = lastname.slice(0,2) + lastname.slice(3);
            username = firstname + '.' + lastname.substring(0,3);
            user = await User.findOne({username: username});
        }
    }

    // Create User
    const user = await User.create({
        username,
        password,
        first_name,
        middle_name,
        last_name,
        email,
        group,
        isAdvisor
    });

    res.status(200).json({
        success : true,
        message : 'User has been created.',
        data : user
    });
});