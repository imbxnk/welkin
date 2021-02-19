const mongoose = require('mongoose');

const remarkSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    student : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required : true
    },
    content : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('Remark', remarkSchema);