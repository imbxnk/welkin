const Curriculum = require('../../../models/curriculum')
const Course = require('../../../models/course')
const ErrorHandler = require('../../../utils/errorHandlers')
const { authorizedGroups } = require('../../../utils/authorizedGroups')

module.exports = {
    Query: {
        //Getting All Curriculums
        curriculums: async(_,{searchInput},{req,res}) => {
            /* ################### Check Authentication ################### */
            // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            /* ################### Check Authentication ################### */

            //Get Curriculums
            let curriculums = await Curriculum.find(searchInput).populate({
                path: 'courses'
            })

            // SORT COURSES BY CODE
            for(let k = 0; k < curriculums.length; k++){
                // INSERTION SORT
                let n = curriculums[k].courses.length
                for(let i = 1; i < n; i++) {
                let current = curriculums[k].courses[i]
                let j = i-1
                while((j > -1) && (current.code < curriculums[k].courses[j].code)) {
                    curriculums[k].courses[j+1] = curriculums[k].courses[j]
                    j--
                }
                curriculums[k].courses[j+1] = current
                }
            }

            return { total: curriculums.length ,curriculums }
        },
        // Getting A Curriculum by Curriculum ID
        curriculum: async (_, { searchInput }, { req, res }) => {
            /* ################### Check Authentication ################### */
            // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            /* ################### Check Authentication ################### */

            try {
                if(searchInput.curriculumId) {
                    searchInput._id = searchInput.curriculumId
                    delete searchInput.curriculumId
                }
            } catch (err) { console.log(err) }

            // Get Curriculum
            let curriculum = await Curriculum.findOne(searchInput).populate({
                path: 'courses'
            })
            if(!curriculum) throw new ErrorHandler(`Curriculum not found.`, 404)

            // INSERTION SORT (SORT COURSES BY CODE)
            let n = curriculum.courses.length
            for(let i = 1; i < n; i++) {
            let current = curriculum.courses[i]
            let j = i-1
            while((j > -1) && (current.code < curriculum.courses[j].code)) {
                curriculum.courses[j+1] = curriculum.courses[j]
                j--
            }
            curriculum.courses[j+1] = current
            }
            
            return { ...curriculum._doc, _id : curriculum._id.toString() }
        }
    },

    Mutation: {
        // Add A New Curriculum
        addCurriculum: async(_, { curriculumInput }, { req, res }) => {
            /* ################### Check Authentication ################### */
            // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            // authorizedGroups(['admin', 'coordinator'], req.user)
            /* ################### Check Authentication ################### */
            let curriculum = await Curriculum.create(curriculumInput).catch( err => { throw new ErrorHandler(err.message, 400) })
            return { ...curriculum._doc, _id: curriculum._id.toString() }
        },
        // Add Course to Curriculum
        addCoursesToCurriculum: async (_, { curriculumId, courseId }, { req, res }) => {
            /* ################### Check Authentication ################### */
            // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            // authorizedGroups(['admin', 'coordinator'], req.user)
            /* ################### Check Authentication ################### */

            // Search Curriculum
            let curriculum = await Curriculum.findById(curriculumId).catch( err => { throw new ErrorHandler(err.message, 400) })
            if(!curriculum) throw new ErrorHandler(`Curriculum not found`, 404)
            // Add Course to curriculum
            // Create own forEach
            async function asyncForEach(array, callback) {
                for (let index = 0; index < array.length; index++) {
                    await callback(array[index], index, array);
                }
            }
            // Create Loop checking every course
            const loop = async() => { 
                let duplicate_items = []
                await asyncForEach(courseId, async (course_id) => {
                        // Check whether the course exists
                        let course = await Course.findById(course_id).catch((err) => {})
                        if(course) {
                            if(!curriculum.courses.includes(course_id)) {
                                curriculum.courses.push(course_id)
                            } else {
                                duplicate_items.push(course.code)
                            }
                        }
                })
                await curriculum.save().catch( err => { throw new ErrorHandler(err.message, 400) })
                return { success: true, message: "Added", duplicate_items }
            }
            return loop()
        },
        // Delete Curriculum
        deleteCurriculum: async(_, { curriculumId }, { req, res }) => {
            /* ################### Check Authentication ################### */
            // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            // authorizedGroups(['admin', 'coordinator'], req.user)
            /* ################### Check Authentication ################### */
            // Search Curriculum
            let curriculum = await Curriculum.findById(curriculumId).catch( err => { throw new ErrorHandler(err.message, 400) })
            if(!curriculum) throw new ErrorHandler(`Curriculum not found`, 404)

            curriculum = await Curriculum.deleteOne({ _id: curriculumId })
            return { success: true, message: "Deleted" }

        }
    }
}