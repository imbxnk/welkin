const mongoose = require('mongoose');

const statusLogSchema = new mongoose.Schema({
    date : {
        type : Date,
        default : Date.now
    },
    from : {
        type : String,
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
    to : {
        type : String,
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
    }
});

module.exports = mongoose.model('StatusLog', statusLogSchema);