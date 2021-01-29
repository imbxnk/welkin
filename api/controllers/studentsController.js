const Student = require('../models/students')

// Get all students => /v1/students
exports.getStudents = async (req, res, next) => {
    const students = await Student.find().catch((err) => {
        console.log(err);
    });
    
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

// Get a student by ID => /v1/student/:sid
exports.getStudent = async (req, res, next) => {
    const student = await Student.find({
        sid : req.params.sid
    }).catch((err) => {
        console.log(err);
    });

    if(!student) {
        return res.status(404).json({
            success : false,
            message : 'Student not found.'
        });
    }

    res.status(200).json({
        success : true,
        data : student
    });
}

// Update a Student Information => /v1/student/:sid
exports.updateStudent = async (req, res, next) => {
    let student = await Student.find({
        sid : req.params.sid
    }).catch((err) => {
        console.log(err);
    });

    if(!student) {
        return res.status(404).json({
            success : false,
            message : 'Student not found.'  
        });
    }

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
}

// Delete a student => /v1/student/:sid
exports.deleteStudent = async (req, res, next) => {
    let student = await Student.find({
        sid : req.params.sid
    });

    if (!student) {
        return res.status(404).json({
            success : false,
            message : 'Student not found.'
        });
    }

    student = await Student.deleteOne({sid : req.params.sid});

    res.status(200).json({
        success : true,
        message : 'Deleted successfully.'
    });
}

// Get Students by Batch => /v1/students/:batch
exports.getStudentsByBatch = async (req, res, next) => {
    const students = await Student.find({
        batch : req.params.batch
    }).catch((err) => {
        console.log(err);
    });

    res.status(200).json({
        success : true,
        batch : req.params.batch,
        total : students.length,
        data : students
    });
}

// Get Students by Batch and Trimester => /v1/students/:batch/:trimester
exports.getStudentsByBatchAndTrimester = async (req, res, next) => {
    const students = await Student.find({
        batch : req.params.batch,
        entry_trimester : req.params.trimester
    }).catch((err) => {
        console.log(err);
    });

    res.status(200).json({
        success : true,
        batch : req.params.batch,
        entry_trimester : req.params.trimester,
        total : students.length,
        data : students
    });
}
