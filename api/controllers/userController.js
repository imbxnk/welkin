const User = require('../models/user');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorhandler');
const sendToken = require('../utils/jwt');

// Get Current User Profile => /v1/me
exports.getUserProfile = catchAsyncErrors ( async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success : true,
        data : user
    })
});

// Update Current User Password => /v1/password/update
exports.updatePassword = catchAsyncErrors ( async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check user old password
    const isMatched = await user.comparePassword(req.body.currentPassword);
    if(!isMatched) {
        return next(new ErrorHandler('Password is incorrect.', 401));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
});