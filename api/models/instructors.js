const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    // คิดว่าจะลิงค์ข้อมูลกับ user ยังไงโดยที่ไม่ต้องสมัคร user ให้อจ.ทุกคนก่อน
});

module.exports = mongoose.model('Course', instructorSchema);