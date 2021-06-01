const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const curriculumSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    batches : {
        type: [String],
        required: true
    },
    courses : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    passing_conditions: {
        core_courses: {
            type: Number,
            required: true
        },
        required_courses: {
            type: Number,
            required: true
        },
        elective_courses: {
            type: Number,
            required: true
        }
    }
})

module.exports = mongoose.model('Curriculum', curriculumSchema)