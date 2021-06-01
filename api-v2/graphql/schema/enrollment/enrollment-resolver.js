const Class = require('../../../models/class')
const Course = require('../../../models/course')
const Instructor = require('../../../models/instructor')
const Student = require('../../../models/student')
const Enrollment = require('../../../models/enrollment')
const mongoose = require('mongoose')

const ErrorHandler = require('../../../utils/errorHandlers')
const { authorizedGroups } = require('../../../utils/authorizedGroups')
const { ObjectId } = require('mongodb')
const { asyncForEach } = require('../../../utils/asyncLoop')

const pdfparse = require('pdf-parse')
const axios = require('axios')

module.exports = {
  Query: {
    countStudent: async (_, { course_code, batch }, { req, res }) => {
      /* ################### Check Authentication ################### */
      // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
      /* ################### Check Authentication ################### */

      // Get Course ID from Course Code
      let course = await Course.findOne({ code: course_code }).catch( err => { throw new ErrorHandler(err.message, 400) })
      if (!course) throw new ErrorHandler(`Course [${course_code}] not found`, 404)
      
      // Get All Classes that is conducted under this course code
      let classes = await Class.find({ course: new ObjectId(course._id) })
        .populate({
          path: 'enrollments',
          populate: {
            path: 'student class'
          }
        })
        .catch( err => { throw new ErrorHandler(err.message, 400) })

      let allClasses = []
      classes.forEach(eachClass => {
        allClasses.push(eachClass._id)
      })

      // Get All Enrollments of the course from every class
      let enrollments = []
      classes.forEach(eachClass => {
        let trimester = eachClass.year + "T" + eachClass.trimester
        eachClass.enrollments.forEach(enrollment => {
          // Filter Batch
          if(enrollment.student.batch === batch) enrollments.push({
            course: eachClass.course,
            sid: enrollment._doc.student.sid,
            grade: enrollment._doc.grade,
            grade_value: enrollment._doc.grade_value,
            trimester
          })
        })
      })
      
      // Remove Duplicated Student (Take course more than 1 time)
      let unique_students = {}
      enrollments.forEach(enrollment => {
        if(enrollment.sid in unique_students) {
          if (enrollment.trimester > unique_students[enrollment.sid].trimester) {
            // Check Wether the latest is PASS (A,B+,B,C+,C,D+,D)
            if (enrollment.grade_value > 0 || enrollment.grade.toUpperCase() === 'S') unique_students[enrollment.sid] = enrollment
            else delete unique_students[enrollment.sid]
          }
        } else {
          // Check Wether the latest is PASS (A,B+,B,C+,C,D+,D)
          if (enrollment.grade_value > 0 || enrollment.grade.toUpperCase() === 'S') unique_students[enrollment.sid] = enrollment
        }
      })

      let students = Object.keys(unique_students).map(key => { return unique_students[key] })
      let total = students.length
      return { batch, course: course_code, total, students }

    },
  },

  Mutation: {
    uploadGrade: async (_, { gradeInput }, { req, res }) => {
      /* ################### Check Authentication ################### */
      // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
      // authorizedGroups(['admin', 'coordinator'], req.user)
      /* ################### Check Authentication ################### */

      const session = await mongoose.startSession()
      session.startTransaction()
      try {

        // Check if class exists
        let _class = await Class.findById(gradeInput.class).catch( err => { throw new ErrorHandler(err.message, 400) })
        if (!_class) throw new ErrorHandler(`Class not found.`, 400)

        
        // Get Student ID from Student UID
        let student = await Student.findOne({ sid: gradeInput.studentId })
        if (!student) {
          // throw new ErrorHandler(`Student Not Found.`, 400)
          // Create Student If not exist
          // student = await Student.create({
          //   sid: gradeInput.studentId,
          //   program: gradeInput.program,
          //   given_name: gradeInput.given_name,
          //   family_name: gradeInput.family_name
          // }).catch( err => { throw new ErrorHandler(err.message, 400) })
          student = new Student()
          student.sid = gradeInput.studentId
          student.program = gradeInput.program
          student.given_name = gradeInput.given_name
          student.family_name = gradeInput.family_name
          await student.save()
        }
        gradeInput["student"] = student._id
        delete gradeInput.studentId

        student = await Student.findById(gradeInput.student)

        // OLD
        // // Check if it is the same class
        // // Create own forEach
        // async function asyncForEach(array, callback) {
        //   for (let index = 0; index < array.length; index++) {
        //     await callback(array[index], index, array);
        //   }
        // }
        // // Create Loop checking every class
        // const loop = async() => { 
        //   await asyncForEach(student.taken_courses, async (course) => {
        //     if(course.class == gradeInput.class) throw new ErrorHandler(`Duplicate Grade Upload for Student ID: ${student.sid}`, 400)
        //   })
        // }
        // await loop()

        // NEW!! Check duplicated taken class
        let taken_courses = []
        try {
          student.taken_courses.forEach((course)=>{
            taken_courses.push(course.class.toString())
          })
          taken_courses.push(gradeInput.class.toString())
          const check = new Set(taken_courses)
          if(taken_courses.length !== check.size) throw new ErrorHandler(`Duplicate Grade Upload for Student ID: ${student.sid}`, 400)
        } catch (err) {}
        // Create Enrollment
        // let enrollment = await Enrollment.create(gradeInput).catch( err => { throw new ErrorHandler(err.message, 400) })
        let enrollment = new Enrollment(gradeInput)
        await enrollment.save()
        // await enrollment.save()
        // Add Enrollment to Class and Student
        _class.enrollments.push(enrollment._id)
        // await _class.save().catch( err => { throw new ErrorHandler(err.message, 400) })
        
        student.taken_courses.push(enrollment._id)
        await student.save().catch( err => { throw new ErrorHandler(err.message, 400) })

        // START HERE
        var uniqueTaken_courses = []
        var totalGrade = 0
        var totalCalculateCredits = 0
        var totalCredits = 0
        var totalCoreCredits = 0
        var totalRequiredCredits = 0
        var totalElectiveCredits = 0

        // Get Student Document
        student = await Student.findById(gradeInput.student)
          .populate({
            path: 'taken_courses',
            populate: {
              path: 'class',
              populate: {
                path: 'course'
              }
            }
          })
          .catch( err => { throw new ErrorHandler(err.message, 400) })

        student.taken_courses.forEach(eachCourse => {
          let trimester = eachCourse.class.year + 'T' + eachCourse.class.trimester
          // let category = eachCourse.class.course.category
          if(Object.keys(uniqueTaken_courses).includes(eachCourse.class.course.code)){
            if(trimester > uniqueTaken_courses[eachCourse.class.course.code].trimester){
              uniqueTaken_courses[eachCourse.class.course.code] = {
                trimester: trimester,
                grade_value: eachCourse.grade_value,
                isGrading: eachCourse.isGrading,
                class: eachCourse.class
              }
            }
          }else{
            uniqueTaken_courses[eachCourse.class.course.code] = {
              trimester: trimester,
              grade_value: eachCourse.grade_value,
              isGrading: eachCourse.isGrading,
              class: eachCourse.class
            }
          }
        });
        [...Object.values(uniqueTaken_courses)].forEach(eachCourse => {
          if(eachCourse.isGrading){
            totalGrade += eachCourse.grade_value * eachCourse.class.course.credit
            totalCalculateCredits += eachCourse.class.course.credit
          }
          totalCredits += eachCourse.class.course.credit

          switch(eachCourse.class.course.category){
            case "core_courses": totalCoreCredits += eachCourse.class.course.credit
              break
            case "required_courses": totalRequiredCredits += eachCourse.class.course.credit
              break
            case "elective_courses": totalElectiveCredits += eachCourse.class.course.credit
              break
          }
        })

        student.records.egci_cumulative_gpa = totalCalculateCredits > 0 ? (totalGrade / totalCalculateCredits).toFixed(2) : "-"
        student.records.core_credits = totalCoreCredits
        student.records.major_credits = totalRequiredCredits
        student.records.elective_credits = totalElectiveCredits
        student.records.total_credits = totalCredits

        await enrollment.save().catch( err => { throw new ErrorHandler(err.message, 400) })
        await _class.save().catch( err => { throw new ErrorHandler(err.message, 400) })
        await student.save().catch( err => { throw new ErrorHandler(err.message, 400) })
        await session.commitTransaction()
        session.endSession()
        return { success: true, message: "Grade has been uploaded." }
      } catch (err) {
        console.log(err)
        await session.abortTransaction()
        session.endSession()
        throw new ErrorHandler(err.message, 400)
      }
    },
    uploadUrl: async (_, { url }, { req, res }) => {
      /* ################### Check Authentication ################### */
      // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
      // authorizedGroups(['admin', 'coordinator'], req.user)
      /* ################### Check Authentication ################### */

      function splitWithTail (str, delim, count) {
        var parts = str.split(delim)
        var tail = parts.slice(count).join(delim)
        var result = parts.slice(0,count)
        result.push(tail)
        return result
      }

      try{
        // get pdf file from firebase storage
        const pdffile = await axios({
          url: url,
          method: 'GET',
          responseType: 'array'
        })

        var classDetail = {
          instructor: '',
          year: '',
          trimester: '',
          section: '',
          course_code: ''
        }

        // Gather info from the pdf file
        const gradeList = await pdfparse(pdffile).then(function (data) {
          var lines = data.text.split(/[\r\n]+/)
          var json = []
          lines.forEach(line => {
            // find the line that contains "EGCI"
            if(line.includes("EGCI", 1)){   //ทำสำหรับ ICXX ด้วย
              let tmp = line.substring(line.search("EGCI"))
              let id = tmp.substring(7,14)
              let program = tmp.substring(14,18)
  
              let info = tmp.substring(18)
              let name = info.replace(/[0-9+]/g, '').slice(0, -1)
              name = splitWithTail(name, ' ', 1)
              let given_name = name[0]
              let family_name = name[1]
              let score = info.replace(/\D/g,'')
              let grade = info.substring(info.search(score) + score.length)
  
              let jsonformat = {
                studentId: id,
                score: ~~score,
                grade,
                program,
                given_name,
                family_name
              }
              json.push(jsonformat)
            }
            // find the line that contains instructor name
            if(line.includes("Grade Report for Instructor",0)){
              classDetail.instructor = line.split(". ").slice(-1).pop()
            }
            // find the line that contains section and course code
            if(line.includes("Section",0)){
              classDetail.course_code = line.split(', ')[0].substring(0,7)
              classDetail.section = line.split(", ")[1].replace( /^\D+/g, '')
            }
            // find the line that contains trimester and year
            if(line.includes("Trimester:")){
              var term = line.split(': ')[2]
              classDetail.year = term.split('T')[0].substring(1,5)
              classDetail.trimester = term.split('T')[1]
            }
          })
          return JSON.parse(JSON.stringify(json))
        })

        // Get Course ID from Course Code
        let course = await Course.findOne({ code: classDetail.course_code }).catch( err => { throw new ErrorHandler(err.message, 400) })
        if (!course) throw new ErrorHandler(`Course [${classDetail.course_code}] not found`, 404)
        let course_id = course._id.toString()

        // Get Instructor ID from Instructor Name
        let instructor = await Instructor.findOne({ name: { $regex: classDetail.instructor, $options: "i" } }).catch( err => { throw new ErrorHandler(err.message, 400) })
        if (!instructor) throw new ErrorHandler(`Instructor [${classDetail.instructor}] not found`)
        let instructor_id = instructor._id.toString()

        // Check Existing Class from course id + trimester + year + section
        let _class = await Class.findOne({ course: course_id, instructor: instructor_id, trimester: classDetail.trimester, year: classDetail.year, section: classDetail.section }).catch( err => { throw new ErrorHandler(err.message, 400) })
        if (_class) throw new ErrorHandler(`This class is already existed.`, 400)

        classDetail["course"] = course_id,
        classDetail["instructor"] = instructor_id
        delete classDetail.course_code

        _class = await Class.create(classDetail).catch( err => { throw new ErrorHandler(err.message, 400) })
        let class_id = _class._id.toString()

        // // Create own forEach
        // async function asyncForEach(array, callback) {
        //   for (let index = 0; index < array.length; index++) {
        //     await callback(array[index], index, array);
        //   }
        // }

        const loop_grade = async() => {
          await asyncForEach(gradeList, async (eachStudent) =>{
            eachStudent["class"] = class_id
            // Get Student ID from Student UID
            let student = await Student.findOne({ sid: eachStudent.studentId })
              .populate({
                path: 'taken_courses'
              })
              .catch( err => { throw new ErrorHandler(err.message, 400) })
            if (!student) {
              student = await Student.create({
                sid: eachStudent.studentId,
                program: eachStudent.program,
                given_name: eachStudent.given_name,
                family_name: eachStudent.family_name
              })
            }

            eachStudent["student"] = student._id
            delete eachStudent.studentId

            // Check duplicated taken class
            let taken_courses = student.taken_courses
            let s_taken_courses = []
            try {
              taken_courses.forEach((course)=>{
                s_taken_courses.push(course.class.toString())
              })
              s_taken_courses.push(eachStudent.class.toString())
              const s = new Set(s_taken_courses)
              if(s_taken_courses.length !== s.size) return
            } catch (err) {}
            
            // Create Enrollment
            let enrollment = await Enrollment.create(eachStudent).catch( err => { throw new ErrorHandler(err.message, 400) })
            
            // Add Enrollment to Class and Student
            _class.enrollments.push(enrollment._id)
            await _class.save().catch( err => { throw new ErrorHandler(err.message, 400) })
            student.taken_courses.push(enrollment._id)

            await student.save().catch( err => { throw new ErrorHandler(err.message, 400) })

            // START HERE
            var uniqueTaken_courses = []
            var totalGrade = 0
            var totalCalculateCredits = 0
            var totalCredits = 0
            var totalCoreCredits = 0
            var totalRequiredCredits = 0
            var totalElectiveCredits = 0

            // Get Student Document
            student = await Student.findById(eachStudent.student)
              .populate({
                path: 'taken_courses',
                populate: {
                  path: 'class',
                  populate: {
                    path: 'course'
                  }
                }
              })

            student.taken_courses.forEach(eachCourse => {
              let trimester = eachCourse.class.year + 'T' + eachCourse.class.trimester
              // let category = eachCourse.class.course.category
              if(Object.keys(uniqueTaken_courses).includes(eachCourse.class.course.code)){
                if(trimester > uniqueTaken_courses[eachCourse.class.course.code].trimester){
                  uniqueTaken_courses[eachCourse.class.course.code] = {
                    trimester: trimester,
                    grade_value: eachCourse.grade_value,
                    isGrading: eachCourse.isGrading,
                    class: eachCourse.class
                  }
                }
              }else{
                uniqueTaken_courses[eachCourse.class.course.code] = {
                  trimester: trimester,
                  grade_value: eachCourse.grade_value,
                  isGrading: eachCourse.isGrading,
                  class: eachCourse.class
                }
              }
            });

            [...Object.values(uniqueTaken_courses)].forEach(eachCourse => {
              if(eachCourse.isGrading){
                totalGrade += eachCourse.grade_value * eachCourse.class.course.credit
                totalCalculateCredits += eachCourse.class.course.credit
              }
              totalCredits += eachCourse.class.course.credit
      
              switch(eachCourse.class.course.category){
                case "core_courses": totalCoreCredits += eachCourse.class.course.credit
                  break
                case "required_courses": totalRequiredCredits += eachCourse.class.course.credit
                  break
                case "elective_courses": totalElectiveCredits += eachCourse.class.course.credit
                  break
              }
            })

            student.records.egci_cumulative_gpa = totalCalculateCredits > 0 ? (totalGrade / totalCalculateCredits).toFixed(2) : "-"
            student.records.core_credits = totalCoreCredits
            student.records.major_credits = totalRequiredCredits
            student.records.elective_credits = totalElectiveCredits
            student.records.total_credits = totalCredits

            await student.save().catch( err => { throw new ErrorHandler(err.message, 400) })
          })
        }
        await loop_grade()
        return { success: true, message: 'Grade is uploaded' }
      }catch(err){
        return { success: false, message: err }
      }
    },
    calculateGrade: async (_, { sid }, { req, res }) => {
      /* ################### Check Authentication ################### */
      // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
      // authorizedGroups(['admin', 'coordinator'], req.user)
      /* ################### Check Authentication ################### */

      let student = await Student.findOne({sid})
      .populate({
        path: 'taken_courses',
        populate: {
          path: 'class',
          populate: {
            path: 'course'
          }
        }
      })
      if(!student) throw new ErrorHandler(`Student not found.`, 404)
      
      // DO IT HERE
      
      var uniqueTaken_courses = []
      var totalGrade = 0
      var totalCalculateCredits = 0
      var totalCredits = 0
      var totalCoreCredits = 0
      var totalRequiredCredits = 0
      var totalElectiveCredits = 0

      student.taken_courses.forEach(eachCourse => {
        let trimester = eachCourse.class.year + 'T' + eachCourse.class.trimester
        // let category = eachCourse.class.course.category
        if(Object.keys(uniqueTaken_courses).includes(eachCourse.class.course.code)){
          if(trimester > uniqueTaken_courses[eachCourse.class.course.code].trimester){
            uniqueTaken_courses[eachCourse.class.course.code] = {
              trimester: trimester,
              grade_value: eachCourse.grade_value,
              isGrading: eachCourse.isGrading,
              class: eachCourse.class
            }
          }
        }else{
          uniqueTaken_courses[eachCourse.class.course.code] = {
            trimester: trimester,
            grade_value: eachCourse.grade_value,
            isGrading: eachCourse.isGrading,
            class: eachCourse.class
          }
        }
      });
      
      [...Object.values(uniqueTaken_courses)].forEach(eachCourse => {
        if(eachCourse.isGrading){
          totalGrade += eachCourse.grade_value * eachCourse.class.course.credit
          totalCalculateCredits += eachCourse.class.course.credit
        }
        totalCredits += eachCourse.class.course.credit

        switch(eachCourse.class.course.category){
          case "core_courses": totalCoreCredits += eachCourse.class.course.credit
            break
          case "required_courses": totalRequiredCredits += eachCourse.class.course.credit
            break
          case "elective_courses": totalElectiveCredits += eachCourse.class.course.credit
            break
        }
      })

      student.records.egci_cumulative_gpa = totalCalculateCredits > 0 ? (totalGrade / totalCalculateCredits).toFixed(2) : "-"
      student.records.core_credits = totalCoreCredits
      student.records.major_credits = totalRequiredCredits
      student.records.elective_credits = totalElectiveCredits
      student.records.total_credits = totalCredits

      await student.save().catch( err => { throw new ErrorHandler(err.message, 400) })

      return { ...student._doc, _id : student._id.toString() }
    }
  }
}
