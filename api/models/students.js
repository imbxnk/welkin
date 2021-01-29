const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    sid : {
        type : String,
        required : [true, 'Please enter the student id'],
        trim : true,
        unique : true,
        validate : [sidValidator, 'Please enter the correct format of Student ID']
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
            message : 'Please select correct options for the Prefix'
        }
    },
    batch : {
        type : String
    },
    first_name : {
        type : String,
        required : true
    },
    middle_name : {
        type : String
    },
    last_name : {
        type : String,
        uppercase : true,
        required : true
    },
    nick_name : {
        type : String
    },
    program : {
        type : String,
        required : true,
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
            message : 'Please enter the correct Program code'
        }
    },
    avatar_url : {
        type : String
    },
    line_id : {
        type : String
    },
    entry_trimester : {
        type : String,
        required : true
    },
    entry_year : {
        type : String,
        required : true
    },
    taken_courses : {
        type : [Object]
    }
});

// Automatic assign batch according to ID
studentSchema.pre('save', function(next) {
    this.batch = this.sid.substring(0,3);
    next();
});

function sidValidator(sid) {
    return sid.length == 7;
}

module.exports = mongoose.model('Student', studentSchema)