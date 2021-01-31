const mongoose = require('mongoose');

const curriculumSchema = new mongoose.Schema({
    course : {
        type : mongoose.Schema.ObjectID,
        ref: 'User',
        required : true
    }
});

module.exports = mongoose.model('Curriculum', curriculumSchema);