const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    class : {
        type : mongoose.Schema.ObjectID,
        ref : 'Class',
        required : true
    },
    student : {
        type : mongoose.Schema.ObjectID,
        ref : 'Student',
        required : true
    },
    score : {
        type : Number,
        required : true,
        min : 0,
        max : 100
    },
    grade : {
        type : String,
        required : true,
        enum : {
            values : [
                'A',
                'B+',
                'B',
                'C+',
                'C',
                'D+',
                'D',
                'S',
                'X',
                'F',
                'AU',
                'I',
                'W',
                'U'
            ],
            message : 'Please enter a correct Grade'
        }
    }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);