const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    id : {
        type : String,
        required : [true, 'Please enter the student id'],
        trim : true,
        length : [7, 'Please enter the correct format of id'],
        unique : true
    },
    prefix : {
        type : String,
        required : true,
        enum : {
            value : [
                'Mr.',
                'Ms.',
                'Mrs.',
                'Miss'
            ],
            message : 'Please select correct options for the Prefix'
        }
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
        required : true
    },
    nick_name : {
        type : String
    },
    program : {
        type : String,
        required : true,
        enum : {
            value : [
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
            message : 'Please select the correct Program code'
        }
    },
    avatar_url : {
        type : String
    },
    line_id : {
        type : String,
        unique : true
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

module.exports = mongoose.model('Student', studentSchema)