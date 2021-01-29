const express = require('express');
const router = express.Router();

const {
    getStudents,
    newStudent
} = require('../controllers/studentsController');

router.route('/students').get(getStudents);
router.route('/student/new').post(newStudent);

module.exports = router;