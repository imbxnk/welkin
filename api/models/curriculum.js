const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const curriculumSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    batches : {
        type : [String],
        required : true
    },
    core_courses : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    required_courses : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    elective_courses : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

module.exports = mongoose.model('Curriculum', curriculumSchema);