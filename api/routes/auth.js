const express = require('express');
const router = express.Router();

const {
    createUser
} = require('../controllers/authController');

router.route('/user/create').post(createUser);

module.exports = router;