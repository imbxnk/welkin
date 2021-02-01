const express = require('express');
const router = express.Router();

// Users Controller
const {
    createAdmin,
    createUser,
    login,
    logout,
    requestPasswordRecovery,
    resetPassword
} = require('../controllers/authController');

// Authentication Middlewares
const {
    isAuthenticated,
    authorizedGroups
} = require('../middlewares/auth');

router.route('/admin/create').post(createAdmin);    
router.route('/user/create').post(isAuthenticated, authorizedGroups('coordinator', 'admin'), createUser);
router.route('/login').post(login);
router.route('/password/reset').post(requestPasswordRecovery);
router.route('/password/reset/:token').put(resetPassword);
router.route('/logout').get(isAuthenticated, logout);

module.exports = router;