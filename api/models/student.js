const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    sid : {
        type : String,
        required : [true, 'Please enter the student id.'],
        trim : true,
        unique : true,
        validate : [sidValidator, 'Please enter the correct format of Student ID.']
    },
    program : {
        type : String,
        required : [true, 'Please enter the program of the student.'],
        enum : {
            values : [
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
            message : 'Please enter the correct Program code.'
        }
    },
    prefix : {
        type : String,
        required : true,
        enum : {
            values : [
                'Mr.',
                'Ms.',
                'Mrs.',
                'Miss'
            ],
            message : 'Please select correct options for the Prefix.'
        }
    },
    given_name : {
        type : String,
        required : true
    },
    family_name : {
        type : String,
        uppercase : true,
        required : true
    },
    entry_trimester : {
        type : String,
        required : [true, 'Please enter the entry trimester of the student.'],
        enum : {
            values : [
                '1',
                '2',
                '3'
            ],
            message : 'Please enter the correct trimester.'
        }
    },
    entry_year : {
        type : String,
        required : true
    },
    nick_name : {
        type : String
    },
    batch : {
        type : String
    },
    avatar_url : {
        type : String
    },
    email : {
        type : String
    },
    phone : {
        type : String
    },
    line_id : {
        type : String
    },
    line_uid : {
        select : false,
        type : String
    },
    advisor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor'
    },
    remarks : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Remark'
    },
    status : {
        current : {
            type : String,
            default : 'Studying',
            enum : {
                values : [
                    'Studying',
                    'Leave of absence',
                    'On Exchange',
                    'Retired',
                    'Resigned',
                    'Alumni'
                ]
            }
        },
        history : [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StatusLog'
        }]
    },
    taken_courses : {
        select : false,
        core_courses : [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Enrollment'
        }],
        required_courses : [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Enrollment'
        }],
        elective_courses : [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Enrollment'
        }]
    }
});

// Automatic assign batch according to ID
studentSchema.pre('save', function(next) {
    this.batch = this.sid.slice(0, -4);
    next();
});

// Simple Student ID Validator
function sidValidator(sid) {
    return sid.length === 7 && (sid.match(/^[0-9]+$/) != null);
}

module.exports = mongoose.model('Student', studentSchema);