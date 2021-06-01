const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    sid: {
        type: String,
        required: [true, 'Please enter the student id.'],
        trim: true,
        unique: true,
        validate: [sidValidator, 'Please enter the correct format of Student ID.']
    },
    program: {
        type: String,
        required: [true, 'Please enter the program of the student.'],
        enum: {
            values: [
                'ICBE',
                'ICCI',
                'ICCS',
                'ICMI',
                'ICMF',
                'ICMK',
                'ICCU',
                'ICSS',
                'ICMC',
                'ICCD',
                'ICIR',
                'ICIH',
                'ICIB',
                'ICEN',
                'ICCH',
                'ICPY',
                'ICFS'
            ],
            message: 'Please enter the correct Program code.'
        }
    },
    prefix: {
        type: String,
        enum: {
            values : [
                'Mr.',
                'Ms.',
                'Mrs.',
                'Miss'
            ],
            message: 'Please select correct options for the Prefix.'
        }
    },
    given_name: {
        type: String,
        required: true
    },
    family_name: {
        type: String,
        uppercase: true,
        required: true
    },
    entry_trimester: {
        type: String,
        enum: {
            values: [
                '1',
                '2',
                '3'
            ],
            message: 'Please enter the correct trimester.'
        }
    },
    entry_year: {
        type: String
    },
    nick_name: {
        type: String
    },
    batch: {
        type: String
    },
    avatar_url: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    lineID: {
        type: String
    },
    lineUID: {
        select: false,
        type: String
    },
    advisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor'
    },
    remarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Remark'
    }],
    status: {
        current: {
            type: String,
            default: 'Studying',
            enum: {
                values: [
                    'Studying',
                    'Leave of absence',
                    'On Exchange',
                    'Retired',
                    'Resigned',
                    'Alumni',
                    'Unknown'
                ]
            }
        },
        history: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StatusLog'
        }]
    },
    taken_courses: [{
        select: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enrollment'
    }],
    records: {
        egci_cumulative_gpa: {
            type: String,
            default: '-'
        },
        core_credits: {
            type: Number,
            default: 0
        },
        major_credits: {
            type: Number,
            default: 0
        },
        elective_credits: {
            type: Number,
            default: 0
        },
        total_credits: {
            type: Number,
            default: 0
        }
    }
});

// Automatic assign batch according to ID
studentSchema.pre('save', function(next) {
    this.given_name = this.given_name.trim()
    this.family_name = this.family_name.trim()
    this.batch = this.sid.slice(0, -5)
    if(!this.entry_year) this.status.current = "Unknown"
    next()
});

// Simple Student ID Validator
function sidValidator(sid) {
    return sid.length === 7 && (sid.match(/^[0-9]+$/) != null);
}

module.exports = mongoose.model('Student', studentSchema);