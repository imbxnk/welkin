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

// Authentication Middlewares
const {
    isAuthenticated,
    authorizedGroups
} = require('../middlewares/auth');

// Student Routes
// router.route('/students').get(isAuthenticated, getStudents);
// router.route('/student/new').post(isAuthenticated, authorizedGroups('coordinator', 'admin'), newStudent);
// router.route('/student/:sid').get(isAuthenticated, getStudent)
//     .put(isAuthenticated, authorizedGroups('coordinator', 'admin'), updateStudent)
//     .delete(isAuthenticated, authorizedGroups('coordinator', 'admin'), deleteStudent);

router.route('/students').get(getStudents);
router.route('/student/new').post(newStudent);
router.route('/student/:sid').get(getStudent)
    .put(updateStudent)
    .delete(deleteStudent);

module.exports = router;