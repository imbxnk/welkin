const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    title : {
        type : String,
    },
    name : {
        type : String,
        required : true
    },
    email : {
        type : [String]
    },
    phone : {
        type : [String]
    }
});
module.exports = mongoose.model('Course', instructorSchema);