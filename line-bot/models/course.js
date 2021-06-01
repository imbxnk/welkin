const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: {
            values: [
                'core_courses',
                'required_courses',
                'elective_courses'
            ],
            message: 'Please select a proper category.'
        }
    },
    code: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        validate: [codeValidator, 'Please enter the correct format of course code.']
    },
    description: {
        type: String,
        default: 'No description'
    },
    credit: {
        type: Number,
        required: true
    },
    credit_description: {
        lecture: {
          type: Number,
          required: true
        },
        lab: {
          type: Number,
          required: true
        },
        self_study: {
          type: Number,
          required: true
        },
    }
})

// Simple Course Code Validation
function codeValidator(code) {
    return code.length === 7 && (code.slice(0,4).match(/^[A-Za-z]+$/) != null) && (code.slice(4).match(/^[0-9]+$/) != null)
}

module.exports = mongoose.model('Course', courseSchema)