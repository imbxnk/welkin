const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncError');

// Create a new user => /v1/user/create
exports.createUser = catchAsyncErrors( async (req, res, next) => {
    const {usermame, password, first_name, middle_name, last_name, email, group, avatar_url} = req.body;

    const user = await User.create({
        username,
        password,
        first_name,
        middle_name,
        last_name,
        email,
        group,
        avatar_url
    });

    res.status(200).json({
        success : true,
        message : 'User has been created.',
        data : user
    });
});