const express = require('express');
const router = express.Router();

// User Controller
const {
    getUserProfile,
    updatePassword
} = require('../controllers/userController');

// Authentication Middlewares
const {
    isAuthenticated
} = require('../middlewares/auth');

router.route('/me').get(isAuthenticated, getUserProfile);
router.route('/password/update').put(isAuthenticated, updatePassword);

module.exports = router;