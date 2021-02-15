const Student = require('../models/student');
const catchAsyncErrors = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorhandler');
const APIFilters = require('../utils/students_filters');

// Get all students => /v1/students
exports.getStudents = catchAsyncErrors ( async (req, res, next) => {
    const apiFilters = new APIFilters(Student.find(), req.query)
        .filter()
        .sort()
        // .limitFields()
        // .pagination();
    const students = await apiFilters.query;
    
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
    const apiFilters = new APIFilters(Student.find({sid : req.params.sid}), req.query).limitFields();
    const student = await apiFilters.query;

    if(student.length === 0) return next(new ErrorHandler('Student not found.', 404));

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

    if(student.length === 0) return next(new ErrorHandler('Student not found.', 404));

    student = await Student.findOneAndUpdate({sid : req.params.sid}, req.body, {
        new : true,
        runValidators : true,
        useFindAndModify : false
    }).catch((err) => {
        console.log(err);
    });

    res.status(200).json({
        success : true,
        message : 'Student Information has been updated.',
        data : student
    });
});

// Delete a student => /v1/student/:sid
exports.deleteStudent = catchAsyncErrors ( async (req, res, next) => {
    let student = await Student.find({
        sid : req.params.sid
    });

    if(student.length === 0) return next(new ErrorHandler('Student not found.', 404));

    student = await Student.deleteOne({sid : req.params.sid});

    res.status(200).json({
        success : true,
        message : 'Deleted successfully.'
    });
});

// Show Student Profile
exports.getStudentProfile = catchAsyncErrors ( async (req, res, next) => {
    const student = await Student.find({ sid : req.user.sid })
});