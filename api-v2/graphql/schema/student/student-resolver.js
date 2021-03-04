const Student = require('../../../models/student')
const User = require('../../../models/user')
const ErrorHandler = require('../../../utils/errorHandlers')
const JWT = require('jsonwebtoken')

module.exports = {
    Query : {
        // Getting All Students
        students : async () => {
            let students = await Student.find({})
            return students
        },
        // Getting A Student by Student ID
        student : async (_, { searchInput }, { req, res }) => {

            // Get User Info From Token
            let token
            if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
                token = req.headers.authorization.split(' ')[1]
            if(!token) throw new ErrorHandler('Unauthorized.', 401)
            const decoded = JWT.verify(token, process.env.JWT_SECRET)   // Decode JSON Web Token
            req.user = await User.findById(decoded.id)                  // Get User from ID

            // Check Group Permission
            groups = ['admin', 'coordinator']
            if(!groups.includes(req.user.group)) throw new ErrorHandler('Unauthorized.', 401)

            // Get Student
            let student = await Student.findOne(searchInput)
            if(!student) throw new ErrorHandler(`Student not found.`, 404)
            return { ...student._doc, _id : student._id.toString() }
        }
    },

    Mutation : {
        // Creating A new Student
        addStudent : async (_, { studentInput }) => {
            // Check Existing Student from Student ID
            let student = await Student.findOne({ sid : studentInput.sid })
            if(student) throw new ErrorHandler(`Student ID [${studentInput.sid}] exsists already.`, 400)
            // Create A new Student
            student = await Student.create(studentInput).catch( err => { throw new ErrorHandler(err.message, 400) })
            return { ...student._doc, _id : student._id.toString() }
        },
        // Updating A Student
        updateStudent : async (_, { searchInput, studentInput }) => {
            // Check Existing Student from Student ID
            let student = await Student.findOne(searchInput)
            if(!student) throw new ErrorHandler(`Student not found.`, 404)
            // Update A Student
            student = await Student.findOneAndUpdate(searchInput, studentInput, {
                new : true,
                runValidators : true,
                useFindAndModify : false
            }).catch( err => { throw new ErrorHandler(`Failed to update Student.`, 500)})
            return { ...student._doc, _id : student._id.toString() }
        }
    }
}