const Student = require('../models/students');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middlewares/catchAsyncError');

// Get all students => /v1/students
exports.getStudents = catchAsyncErrors ( async (req, res, next) => {
    const students = await Student.find();
    
    res.status(200).json({
        success : true,
        total : students.length,
        data : students
    });
});

// Add a new Student => /v1/students/new
exports.newStudent = catchAsyncErrors ( async (req, res, next) => {
    const student = await Student.create(req.body);

    res.status(200).json({
        success : true,
        message : 'Student is added.',
        data : student
    });
});

// Get a student by ID => /v1/student/:sid
exports.getStudent = catchAsyncErrors ( async (req, res, next) => {
    const student = await Student.find({
        sid : req.params.sid
    });

    if(student.length == 0) return next(new ErrorHandler('Student not found', 404));

    res.status(200).json({
        success : true,
        data : student
    });
});

// Update a Student Information => /v1/student/:sid
exports.updateStudent = catchAsyncErrors ( async (req, res, next) => {
    let student = await Student.find({
        sid : req.params.sid
    });

    if(student.length == 0) return next(new ErrorHandler('Student not found', 404));

    student = await Student.findOneAndUpdate({sid : req.params.sid}, req.body, {
        new : true,
        runValidators : true,
        useFindAndModify : false
    }).catch((err) => {
        console.log(err);
    });

    res.status(200).json({
        success : true,
        message : 'Student Information has been updated',
        data : student
    });
});

// Delete a student => /v1/student/:sid
exports.deleteStudent = catchAsyncErrors ( async (req, res, next) => {
    let student = await Student.find({
        sid : req.params.sid
    });

    if(student.length == 0) return next(new ErrorHandler('Student not found', 404));

    student = await Student.deleteOne({sid : req.params.sid});

    res.status(200).json({
        success : true,
        message : 'Deleted successfully.'
    });
});

// Get Students by Batch => /v1/students/:batch
exports.getStudentsByBatch = catchAsyncErrors ( async (req, res, next) => {
    const students = await Student.find({
        batch : req.params.batch
    });

    if(students.length != 3) return next(new ErrorHandler('Batch not found', 404));

    res.status(200).json({
        success : true,
        batch : req.params.batch,
        total : students.length,
        data : students
    });
});

// Get Students by Batch and Trimester => /v1/students/:batch/:trimester
exports.getStudentsByBatchAndTrimester = catchAsyncErrors ( async (req, res, next) => {
    const students = await Student.find({
        batch : req.params.batch,
        entry_trimester : req.params.trimester
    });

    if(students.length != 3) return next(new ErrorHandler('Batch not found', 404));

    res.status(200).json({
        success : true,
        batch : req.params.batch,
        entry_trimester : req.params.trimester,
        total : students.length,
        data : students
    });
});
