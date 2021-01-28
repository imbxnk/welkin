// Get all students => /v1/students/

exports.getStudents = (req, res, next) => {
    res.status(200).json({
        success: true,
        message : 'Kuy Mix'
    });
}