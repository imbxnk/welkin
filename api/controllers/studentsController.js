const Student = require('../models/students')

// Get all students => /v1/students
exports.getStudents = async (req, res, next) => {
    const students = await Student.find();
    
    res.status(200).json({
        success : true,
        total : students.length,
        data : students
    });
}

// Add a new Student => /v1/students/new
exports.newStudent = async (req, res, next) => {
    const student = await Student.create(req.body).catch((err) => {
        console.log(err);
    });

    res.status(200).json({
        success : true,
        message : 'Student is added.',
        data : student
    });
}

// Get a student by ID => /v1/student/:id
exports.getStudent = async (req, res, next) => {
    const student = await Student.find({
        sid : req.params.id
    });

    res.status(200).json({
        success : true,
        data : student
    })
}

// Update a Student Information => /v1/student/:id