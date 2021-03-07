const Student = require('../../../models/student')
const ErrorHandler = require('../../../utils/errorHandlers')
const { authorizedGroups } = require('../../../utils/authorizedGroups')

module.exports = {
    Query : {
        // Getting All Students
        students : async (_, { searchInput }, { req, res }) => {
            /* ################### Check Authentication ################### */
            // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            /* ################### Check Authentication ################### */

            // Get Students
            let students = await Student.find(searchInput)
            return { total : students.length, students }
        },
        // Getting A Student by Student ID
        student : async (_, { searchInput }, { req, res }) => {
            /* ################### Check Authentication ################### */
            if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            /* ################### Check Authentication ################### */

            // Get Student
            let student = await Student.findOne(searchInput)
            if(!student) throw new ErrorHandler(`Student not found.`, 404)
            return { ...student._doc, _id : student._id.toString() }
        }
    },

    Mutation : {
        // Creating A new Student
        addStudent : async (_, { studentInput }, { req, res }) => {
            /* ################### Check Authentication ################### */
            // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            // authorizedGroups(['admin', 'coordinator'], req.user)
            /* ################### Check Authentication ################### */

            // Check Existing Student from Student ID
            let student = await Student.findOne({ sid : studentInput.sid })
            if(student) throw new ErrorHandler(`Student ID [${studentInput.sid}] exsists already.`, 400)
            // Create A new Student
            student = await Student.create(studentInput).catch( err => { throw new ErrorHandler(err.message, 400) })
            return { ...student._doc, _id : student._id.toString() }
        },
        // Updating A Student
        updateStudent : async (_, { searchInput, studentInput }) => {
            /* ################### Check Authentication ################### */
            if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            authorizedGroups(['admin', 'coordinator'], req.user)
            /* ################### Check Authentication ################### */

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
        },
        // Deleting A Student
        deleteStudent : async (_, { searchInput }) => {
            /* ################### Check Authentication ################### */
            if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            authorizedGroups(['admin', 'coordinator'], req.user)
            /* ################### Check Authentication ################### */

            // Check Existing Student from Student ID
            let student = await Student.findOne(searchInput)
            if(!student) throw new ErrorHandler(`Student not found.`, 404)
            student = await Student.deleteOne(searchInput)
            return { success: true, message : `${student.deletedCount} student has been deleted.` }
        }
    }
}