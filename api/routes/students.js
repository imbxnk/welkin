const express = require('express');
const router = express.Router();

const {
    getStudents,
    getStudent,
    newStudent,
    updateStudent,
    deleteStudent,
    getStudentsByBatch,
    getStudentsByBatchAndTrimester
} = require('../controllers/studentsController');

router.route('/students').get(getStudents);
// router.route('/students/:batch').get(getStudentsByBatch);
// router.route('/students/:batch/:trimester').get(getStudentsByBatchAndTrimester);
router.route('/student/:sid').get(getStudent);
router.route('/student/new').post(newStudent);
router.route('/student/:sid').put(updateStudent);
router.route('/student/:sid').delete(deleteStudent);

module.exports = router;