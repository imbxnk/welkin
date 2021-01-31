const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    course : {
        type : mongoose.Schema.ObjectId,
        ref: 'Course',
        required : true
    },
    instructor : {
        type : mongoose.Schema.ObjectId,
        ref : 'Instructor',
        required : true
    },
    trimester : {
        type : String,
        uppercase : true,
        required : true,
        enum : {
            values : [
                '1',
                '2',
                '3',
                'S'
            ],
            message : 'Please select a correct trimester.'
        }
    },
    year : {
        type : String,
        required : true
    },
    students : {
        type : [mongoose.Schema.ObjectId],
        ref : 'Student',
    }
});

module.exports = mongoose.model('Course', classSchema);