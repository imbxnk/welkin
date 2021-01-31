const express = require('express');
const router = express.Router();

// Users Controller
const {
    createAdmin,
    createUser,
    loginUser
} = require('../controllers/authController');

// Authentication Middlewares
const {
    isAuthenticated,
    authorizedGroups
} = require('../middlewares/auth');

router.route('/admin/create').post(createAdmin);    
router.route('/user/create').post(isAuthenticated, authorizedGroups('coordinator', 'admin'), createUser);
router.route('/login').post(loginUser);

module.exports = router;