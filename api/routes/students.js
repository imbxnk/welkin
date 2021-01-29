const express = require('express');
const router = express.Router();

const {
    getStudents,
    getStudent,
    newStudent,
    updateStudent
} = require('../controllers/studentsController');

router.route('/students').get(getStudents);
router.route('/student/:sid').get(getStudent);
router.route('/student/new').post(newStudent);
router.route('/student/:sid').put(updateStudent);

module.exports = router;