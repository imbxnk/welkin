const Course = require('../../../models/course')
const ErrorHandler = require('../../../utils/errorHandlers')
const { authorizedGroups } = require('../../../utils/authorizedGroups')

module.exports = {
    Query: {
        //Getting All Courses
        courses: async(_,{searchInput},{req,res}) => {
            /* ################### Check Authentication ################### */
            // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            /* ################### Check Authentication ################### */

            //Get Courses
            let courses = await Course.find(searchInput).catch( err => { throw new ErrorHandler(err.message, 400) })

            // INSERTION SORT (SORT STUDENT)
            let n = courses.length
            for(let i = 1; i < n; i++) {
                let current = courses[i]
                let j = i-1
                while((j > -1) && (current.code < courses[j].code)) {
                    courses[j+1] = courses[j]
                    j--
                }
                courses[j+1] = current
            }

            return { total: courses.length, courses }
        },
        course : async (_, { searchInput }, { req, res }) => {
            /* ################### Check Authentication ################### */
            // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            /* ################### Check Authentication ################### */

            // Get Course
            let course = await Course.findOne(searchInput).catch( err => { throw new ErrorHandler(err.message, 400) })
            if(!course) throw new ErrorHandler(`Course not found.`, 404)
            return { ...course._doc, _id : course._id.toString() }
        }
    },

    Mutation: {
        // Creating A new Course
        addCourse: async(_,{ courseInput }, {req,res}) => {
            /* ################### Check Authentication ################### */
            // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            // authorizedGroups(['admin', 'coordinator'], req.user)
            /* ################### Check Authentication ################### */

            // Check Existing course from course code
            let course = await Course.findOne({ code : courseInput.code })
            if(course) throw new ErrorHandler(`Course code [${courseInput.code}] exists already.`, 400)
            // Create A new Course
            course = await Course.create(courseInput).catch( err => { throw new ErrorHandler(err.message, 400) })
            return { ...course._doc, _id : course._id.toString() }
        },
        // Updating A Course
        updateCourse: async (_, { searchInput, courseInput }) => {
            /* ################### Check Authentication ################### */
            // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            // authorizedGroups(['admin', 'coordinator'], req.user)
            /* ################### Check Authentication ################### */

            // Check Existing Course from Course ID
            let course = await Course.findOne(searchInput).catch( err => { throw new ErrorHandler(err.message, 400) })
            if(!course) throw new ErrorHandler(`Course not found.`, 404)
            // Update A Course
            course = await Course.findOneAndUpdate(searchInput, courseInput, {
                new : true,
                runValidators : true,
                useFindAndModify : false
            }).catch( err => { throw new ErrorHandler(`Failed to update Course.`, 500)})
            return { ...course._doc, _id : course._id.toString() }
        },
        // Deleting A Course
        deleteCourse: async (_, { searchInput }) => {
            /* ################### Check Authentication ################### */
            // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            // authorizedGroups(['admin', 'coordinator'], req.user)
            /* ################### Check Authentication ################### */

            // Check Existing Course from Course ID
            let course = await Course.findOne(searchInput).catch( err => { throw new ErrorHandler(err.message, 400) })
            if(!course) throw new ErrorHandler(`Course not found.`, 404)
            course = await Course.deleteOne(searchInput).catch( err => { throw new ErrorHandler(err.message, 400) })
            return { success: true, message : `${course.deletedCount} course has been deleted.` }
        }
    }
}