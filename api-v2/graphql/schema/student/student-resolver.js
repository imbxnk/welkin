const Student = require('../../../models/student')
const Instructor = require('../../../models/instructor')
const ErrorHandler = require('../../../utils/errorHandlers')
const { authorizedGroups } = require('../../../utils/authorizedGroups')
const { asyncForEach } = require('../../../utils/asyncLoop')

const axios = require('axios')

module.exports = {
  Query: {
    // Getting All Students
    students: async (_, { searchInput, sortBy }, { req, res }) => {
      /* ################### Check Authentication ################### */
      // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
      /* ################### Check Authentication ################### */

      // Get Students
      let students = await Student.find(searchInput)
        .populate({
          path: 'taken_courses',
          populate: {
            path: 'class',
            populate: {
              path: 'course instructor'
            }
          }
        })
        .populate({
          path: 'remarks',
          populate: {
            path: 'user'
          }
        })
        .populate({
          path: 'advisor'
        })
        .sort({
          sid: 1
        })

      // sort by
      let sortOrder = []
      try {
        switch (sortBy) {
          case 'status':
            sortOrder = ['Studying', 'On Exchange', 'Leave of absence', 'Retired', 'Resigned', 'Alumni', 'Unknown']
            break
        }
      } catch (err) {
        console.log(err)
      }

      if (sortOrder.length > 0) {
        students.sort((a, b) => {
          return sortOrder.indexOf(a.status.current) - sortOrder.indexOf(b.status.current)
        })
      }

      return {
        total: students.length,
        students
      }
    },
    // Getting A Student by Student ID
    student: async (_, { searchInput }, { req, res }) => {
      /* ################### Check Authentication ################### */
      // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
      /* ################### Check Authentication ################### */

      // Get A Student
      let student = await Student.findOne(searchInput)
        .populate({
          path: 'taken_courses',
          populate: {
            path: 'class',
            populate: {
              path: 'course instructor'
            }
          }
        })
        .populate({
          path: 'remarks',
          populate: {
            path: 'user'
          }
        })
        .populate({
          path: 'advisor'
        })
        .catch(err => {
          throw new ErrorHandler(err.message, 400)
        })
      if (!student) throw new ErrorHandler(`Student not found.`, 404)
      return {
        ...student._doc,
        _id: student._id.toString()
      }
    },

    // Get Batches
    batches: async (_, { input }, { req, res }) => {
      /* ################### Check Authentication ################### */
      // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
      // authorizedGroups(['admin', 'coordinator'], req.user)
      /* ################### Check Authentication ################### */

      // Get All Batches
      let batches = await Student.distinct('batch')

      return { total: batches.length, batches}
    }
  },

  Mutation: {
    // Creating A new Student
    addStudent: async (_, { studentInput }, { req, res }) => {
      /* ################### Check Authentication ################### */
      // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
      // authorizedGroups(['admin', 'coordinator'], req.user)
      /* ################### Check Authentication ################### */

      // Get Advisor ID
      try {
        if (studentInput.advisor_name) {
          let advisor = await Instructor.findOne({
            name: {
              $regex: studentInput.advisor_name,
              $options: "i"
            }
          }).catch(err => {
            throw new ErrorHandler(err.message, 400)
          })
          if (!advisor) throw new ErrorHandler(`Advisor [${studentInput.advisor_name}] not found. Please add this advisor to instructor before adding students.`, 400)

          delete studentInput.advisor_name
          studentInput.advisor = advisor._id
        }
      } catch (err) {}

      // Check Existing Student from Student ID
      let student = await Student.findOne({
        sid: studentInput.sid
      })
      if (student) throw new ErrorHandler(`Student ID [${studentInput.sid}] exsists already.`, 400)
      // Create A new Student
      student = await Student.create(studentInput).catch(err => {
        throw new ErrorHandler(err.message, 400)
      })
      return {
        ...student._doc,
        _id: student._id.toString()
      }
    },
    // Updating A Student
    updateStudent: async (_, { searchInput, studentInput }, { req, res }) => {
      /* ################### Check Authentication ################### */
      // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
      // authorizedGroups(['admin', 'coordinator'], req.user)
      /* ################### Check Authentication ################### */

      // Check Existing Student from Student ID
      let student = await Student.findOne(searchInput)
      if (!student) throw new ErrorHandler(`Student not found.`, 404)
      // Update A Student
      student = await Student.findOneAndUpdate(searchInput, studentInput, {
        new: true,
        runValidators: true,
        useFindAndModify: false
      }).catch(err => {
        throw new ErrorHandler(`Failed to update Student.`, 500)
      })
      return {
        ...student._doc,
        _id: student._id.toString()
      }
    },
    // Deleting A Student
    deleteStudent: async (_, { searchInput }, { req, res }) => {
      /* ################### Check Authentication ################### */
      // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
      // authorizedGroups(['admin', 'coordinator'], req.user)
      /* ################### Check Authentication ################### */

      // Check Existing Student from Student ID
      let student = await Student.findOne(searchInput)
      if (!student) throw new ErrorHandler(`Student not found.`, 404)
      student = await Student.deleteOne(searchInput)
      return {
        success: true,
        message: `${student.deletedCount} student has been deleted.`
      }
    },
    sendAppointment: async (_, { options, appointment }, { req, res }) => {
      /* ################### Check Authentication ################### */
      // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
      // authorizedGroups(['admin', 'coordinator', 'program director'], req.user)
      /* ################### Check Authentication ################### */
      // Get Student from Student ID
      const students = await Student.find({
        ...options,
        lineUID: {
          $ne: null
        }
      }).select('+lineUID').catch(err => {
        throw new ErrorHandler(err.message, 400)
      })
      // Setup broadcast message
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_TOKEN}`
      }

      let template = {
        messages: [{
          type: "flex",
          altText: "Appointment from an EGCI Instructor",
          contents: {
            type: "bubble",
            hero: {
              type: "image",
              url: appointment.image || "https://www.camphub.in.th/wp-content/uploads/2017/10/Mahidol_University_New.png",
              size: "full",
              aspectRatio: "20:13",
              aspectMode: "cover",
              action: {
                type: "uri",
                uri: appointment.url || "https://muic.io/"
              }
            },
            body: {
              type: "box",
              layout: "vertical",
              spacing: "md",
              contents: [{
                  type: "text",
                  text: appointment.title || "Welkin",
                  wrap: true,
                  weight: "bold",
                  gravity: "center",
                  size: "xl"
                },
                {
                  type: "text",
                  text: appointment.message || "-",
                  margin: "none",
                  color: "#666666"
                },
                {
                  type: "box",
                  layout: "vertical",
                  margin: "lg",
                  spacing: "sm",
                  contents: [{
                      type: "box",
                      layout: "baseline",
                      spacing: "sm",
                      contents: [{
                          type: "text",
                          text: "Date",
                          color: "#aaaaaa",
                          size: "sm",
                          flex: 1
                        },
                        {
                          type: "text",
                          text: appointment.date || "-",
                          wrap: true,
                          size: "sm",
                          color: "#666666",
                          flex: 4
                        }
                      ]
                    },
                    {
                      type: "box",
                      layout: "baseline",
                      spacing: "sm",
                      contents: [{
                          type: "text",
                          text: "Place",
                          color: "#aaaaaa",
                          size: "sm",
                          flex: 1
                        },
                        {
                          type: "text",
                          text: appointment.place || "-",
                          wrap: true,
                          color: "#666666",
                          size: "sm",
                          flex: 4
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        }]
      }

      const broadcaster = async () => {
        await asyncForEach(students, async (student) => {
          console.log(student.given_name)
          let body = template
          body.to = student.lineUID
          body = JSON.stringify(body)
          await axios.post('https://api.line.me/v2/bot/message/push', body, {
            headers
          }).then((res) => {
            console.log(res)
          }).catch(err => {
            console.log(err.response.data.details)
            throw new ErrorHandler(err.message, 400)
          })
        })
      }
      await broadcaster()
      return {
        success: true,
        message: `${students.length} students got the appointment`
      }
    },
    // Broadcast Message to Student's Line
    broadcastStudent: async (_, { sid, message }, { req, res }) => {
      /* ################### Check Authentication ################### */
      // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
      // authorizedGroups(['admin', 'coordinator', 'program director'], req.user)
      /* ################### Check Authentication ################### */

      // Get Student from Student ID
      const student = await Student.findOne({
        sid
      }).select('+lineUID').catch(err => {
        throw new ErrorHandler(err.message, 400)
      })
      if (!student) throw new ErrorHandler(`Student Not Found.`, 404)
      if (!student.lineUID) throw new ErrorHandler(`Student has not registered LINE account with Welkin.`, 404)

      // Broadcast Message to a student
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_TOKEN}`
      }
      let body = JSON.stringify({
        to: student.lineUID,
        messages: [{
          type: "flex",
          altText: "Message from an EGCI Instructor",
          contents: {
            type: "bubble",
            body: {
              type: "box",
              layout: "horizontal",
              contents: [{
                type: "text",
                text: message
              }]
            }
          }
        }]
      })
      return axios.post('https://api.line.me/v2/bot/message/push', body, {
        headers
      }).then((res) => {
        console.log(res.data)
        return {
          success: true,
          message: `The message is broadcasted to ${student.given_name} ${student.family_name} (${sid})`
        }
      }).catch(err => {
        throw new ErrorHandler(err.message, 400)
      })

    },
  }
}