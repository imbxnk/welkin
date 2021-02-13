const express = require('express');
const router = express.Router();

// Course Controller
const {
    getCurriculums,
    newCurriculum,
    addCourse
} = require('../controllers/curriculumController');

// Authentication Middlewares
const {
    isAuthenticated,
    authorizedGroups
} = require('../middlewares/auth');

router.route('/curriculums').get(getCurriculums);
router.route('/curriculum/new').post(newCurriculum);
router.route('/curriculum/:id/add').put(addCourse);

module.exports = router;