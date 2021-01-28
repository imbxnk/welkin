const express = require('express');
const router = express.Router();

const {
    getStudents
} = require('../controllers/studentsController');

router.route('/students').get(getStudents);

module.exports = router;