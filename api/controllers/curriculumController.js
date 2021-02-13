const Curriculum = require('../models/curriculum');
const Course = require('../models/course');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorhandler');
const APIFilters = require('../utils/students_filters');

// Add a new curriculum => /v1/curriculum/new
exports.newCurriculum = catchAsyncErrors ( async (req, res, next) => {
    let curriculum = await Curriculum.find({
        batches : { $in : req.body.batches }
    });
    if (!curriculum || curriculum.length !== 0) return next(new ErrorHandler('Duplicated curriculum for a batch.', 400));

    curriculum = await Curriculum.create(req.body);

    res.status(200).json({
        success : true,
        message : 'Curriculum is added.',
        data : curriculum
    });
});

// Get all curriculum => /v1/curriculums
exports.getCurriculums = catchAsyncErrors ( async (req, res, next) => {
    const apiFilters = new APIFilters(Curriculum.find().populate('core_courses'), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();
    const curriculum = await apiFilters.query;
    
    res.status(200).json({
        success : true,
        total : curriculum.length,
        data : curriculum
    });
});

// Add a new course to curriculum => /v1/curriculum/:id/add/
exports.addCourse = catchAsyncErrors ( async (req, res, next) => {
    
    // Check whether the Curriculum exists or not
    let curriculum = await Curriculum.findById(req.params.id);
    if(!curriculum || curriculum.length === 0) return next(new ErrorHandler('Curriculum not found.', 404));

    const course = await Course.create(req.body)
        .then( async res => {
                // Add to Curriculum
                switch(res.category) {
                    case 'core_courses':
                        await Curriculum.findByIdAndUpdate( req.params.id, {$push : {
                            core_courses : res._id
                        }});
                        break;
                    case 'required_courses':
                        await Curriculum.findByIdAndUpdate( req.params.id, {$push : {
                            required_courses : res._id
                        }});
                        break;
                    case 'elective_courses':
                        await Curriculum.findByIdAndUpdate( req.params.id, {$push : {
                            elective_courses : res._id
                        }});
                        break;
                }
            }
        );

    res.status(200).json({
        success : true,
        message : 'Course is added.',
        data : course
    });

});