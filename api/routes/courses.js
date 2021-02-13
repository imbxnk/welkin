const express = require('express');
const router = express.Router();

// Course Controller
const {
    getCourse
} = require('../controllers/courseController');

// Authentication Middlewares
const {
    isAuthenticated,
    authorizedGroups
} = require('../middlewares/auth');

router.route('/course/:code').get(getCourse);

module.exports = router;