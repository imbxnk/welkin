const Course = require('../models/course');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorhandler');

// Get Course by course code => /v1/course/:code
exports.getCourse = catchAsyncErrors ( async (req, res, next) => {
    const course = await Course.find({
        code : req.params.code
    });

    if(course.length === 0) return next(new ErrorHandler('Course not found.', 404));
    
    res.status(200).json({
        success : true,
        data : course
    });
});
