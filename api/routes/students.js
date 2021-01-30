const express = require('express');
const router = express.Router();

// Student Controller
const {
    getStudents,
    newStudent,
    getStudent,
    updateStudent,
    deleteStudent
} = require('../controllers/studentsController');

// Student Routes
router.route('/students').get(getStudents);
router.route('/student/new').post(newStudent);
router.route('/student/:sid').get(getStudent);
router.route('/student/:sid').put(updateStudent);
router.route('/student/:sid').delete(deleteStudent);

module.exports = router;