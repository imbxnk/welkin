const {
  reply,
  replies,
  rawReply,
  getUserProfile,
  pushMessage
} = require('./line-utils')
const validator = require('validator')

// Import Mongoose Schema(s)
const Student = require('../models/student')
const Instructor = require('../models/instructor')
const Curriculum = require('../models/curriculum')
const Course = require('../models/course')

exports.register = async (replyToken, lineUID, userInput) => {
  // Get LINE User Profile
  let userProfile = await getUserProfile(lineUID)
  // Save Student's Data to Database
  const student = await Student.findOne({
    sid: userInput.studentID
  }).select('+lineUID').catch((err) => {
    console.log(err.message)
  })
  if (!student) return reply(replyToken, `Student (id: ${userInput.studentID}) not found. Try to check your student id again or contact the administrator.`)
  student.lineUID = lineUID
  if (userInput.email !== '-') student.email = userInput.email.toLowerCase()
  if (userInput.phone !== '-') student.phone = userInput.phone
  if (userProfile.pictureUrl) student.avatar_url = userProfile.pictureUrl
  await student.save().catch((err) => {
    console.log(err.message)
  })
  // Send succesful message back to Student
  // pushMessage(lineUID, "Successfully Registered!") // Paid Message
  return reply(replyToken, "Successfully Registered!")
}

exports.checkRepeatedRegistration = async (replyToken, lineUID) => {
  // Check Whether this LINE UID is registered
  const student = await Student.findOne({
    lineUID: lineUID
  }).catch((err) => {
    console.log(err.message)
  })
  if (student) {
    await replies(replyToken, [`Registration Failed!`, `This LINE account has already been registered with Welkin.\nContact the administrator for help.`])
    return false
  }
  return true
}

exports.checkStudentIDandFullName = async (replyToken, userInput) => {
  // Check Student in Databbase
  const student = await Student.findOne({
    sid: userInput.studentID
  }).select('+lineUID').catch((err) => {
    console.log(err.message)
  })
  if (!student) {
    reply(replyToken, `Student (id: ${userInput.studentID}) not found. Try to check your student id again or contact the administrator.`)
    return false
  }

  // Check Full Name
  let checkedName = student.given_name.trim() + ' ' + student.family_name.trim()
  if (checkedName.trim().toLowerCase() !== userInput.fullName.toLowerCase()) {
    reply(replyToken, `Incorrect Full Name of Student (id: ${userInput.studentID}). Try to check the spelling again or contact the administrator.`)
    return false
  }

  return true
}

exports.validateEmail = async (userInput) => {
  if (userInput.email.toLowerCase() === 'skip') {
    userInput.email = ""
    return userInput
  } else {
    if (validator.isEmail(userInput.email)) return userInput
    return false
  }
}

exports.validatePhone = async (userInput) => {
  if (userInput.phone.toLowerCase() === 'skip') {
    userInput.phone = ""
    return userInput
  } else {
    if (validator.isMobilePhone(userInput.phone, ["th-TH"])) return userInput
    return false
  }
}

exports.sendConfirmation = async (replyToken, userInput) => {
  let messages = {
    replyToken,
    messages: [{
      type: "flex",
      contents: {
        type: "bubble",
        size: "giga",
        hero: {
          type: "image",
          size: "full",
          aspectRatio: "2:1",
          aspectMode: "cover",
          url: "https://cdn.welkin.app/static/img/line-registration-flex-cover.png?v2"
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [{
            type: "text",
            text: "Registration",
            weight: "bold",
            size: "xl"
          }, {
            type: "text",
            text: "Please make sure that the information is correct and valid",
            wrap: true,
            margin: "none",
            size: "xs",
            color: "#999999"
          }, {
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
                text: "Student ID",
                color: "#aaaaaa",
                size: "sm",
                flex: 2
              }, {
                type: "text",
                text: `${userInput.studentID}`,
                wrap: true,
                color: "#666666",
                size: "sm",
                flex: 4
              }]
            }, {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [{
                type: "text",
                text: "Full Name",
                color: "#aaaaaa",
                size: "sm",
                flex: 2
              }, {
                type: "text",
                text: `${capitalize(userInput.fullName)}`,
                wrap: true,
                color: "#666666",
                size: "sm",
                flex: 4
              }]
            }, {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [{
                type: "text",
                text: "Email",
                color: "#aaaaaa",
                size: "sm",
                flex: 2
              }, {
                type: "text",
                text: `${userInput.email.toLowerCase() || "-"}`,
                wrap: true,
                color: "#666666",
                size: "sm",
                flex: 4
              }]
            }, {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [{
                type: "text",
                text: "Phone",
                color: "#aaaaaa",
                size: "sm",
                flex: 2
              }, {
                type: "text",
                text: `${userInput.phone || "-"}`,
                wrap: true,
                color: "#666666",
                size: "sm",
                flex: 4
              }]
            }]
          }]
        },
        footer: {
          type: "box",
          layout: "horizontal",
          spacing: "sm",
          contents: [{
            type: "button",
            style: "link",
            height: "sm",
            action: {
              type: "message",
              label: "Cancel",
              text: "Cancel"
            },
            color: "#00000099"
          }, {
            type: "button",
            style: "link",
            height: "sm",
            action: {
              type: "message",
              label: "Confirm",
              text: "Confirm"
            },
            color: "#007bff"
          }, {
            type: "spacer",
            size: "sm"
          }],
          flex: 0
        }
      },
      altText: "Registration Confirmation"
    }]
  }
  return rawReply(messages)
}

exports.sendFilterOptions = async (replyToken, lineUID) => {
  let messages = {
    replyToken,
    messages: [{
      altText: "flex message",
      contents: {
        type: "bubble",
        size: "kilo",
        direction: "ltr",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          borderColor: "#FFFFFFFF",
          contents: [{
            type: "box",
            layout: "horizontal",
            action: {
              type: "message",
              label: "Student ID",
              text: "studentID"
            },
            height: "46px",
            contents: [{
              type: "text",
              text: "Student ID",
              size: "md",
              color: "#3C84FBFF",
              align: "center",
              gravity: "center",
              contents: []
            }]
          }, {
            type: "box",
            layout: "horizontal",
            action: {
              type: "message",
              label: "Student Name",
              text: "studentName"
            },
            height: "46px",
            contents: [{
              type: "text",
              text: "Student Name",
              size: "md",
              color: "#3C84FBFF",
              align: "center",
              gravity: "center",
              contents: []
            }]
          }, {
            type: "box",
            layout: "horizontal",
            action: {
              type: "message",
              label: "Course Code",
              text: "courseCode"
            },
            height: "46px",
            contents: [{
              type: "text",
              text: "Course Code",
              size: "md",
              color: "#3C84FBFF",
              align: "center",
              gravity: "center",
              contents: []
            }]
          }]
        }
      },
      type: "flex"
    }]
  }
  return rawReply(messages)
}

exports.getStudentInfo = async (replyToken, searchInput) => {
  const student = await Student.findOne(toString(searchInput))
    .populate({
      path: 'advisor'
    })
  if (!student) return reply(replyToken, "Student not found.")

  let studentName = student.given_name + " " + student.family_name
  let studentID = student.sid
  let advisor = student.advisor.name
  let entry = "T" + student.entry_trimester + "/" + student.entry_year
  let email = student.email || "-"
  let phone = student.phone || "-"
  let batch = student.batch

  const curriculum = await Curriculum.findOne({
    batches: batch
  })
  if (!curriculum) return reply(replyToken, "Cannot get correct information, please contact admin.")
  let passing_condition = curriculum.passing_conditions
  let passing_core = {
    text: student.records.core_credits + "/" + passing_condition.core_courses,
    number: Math.round(student.records.core_credits / passing_condition.core_courses * 100).toString()
  }
  let passing_major = {
    text: student.records.major_credits + "/" + passing_condition.required_courses,
    number: Math.round(student.records.major_credits / passing_condition.required_courses * 100).toString()
  }
  let passing_elective = {
    text: student.records.elective_credits + "/" + passing_condition.elective_courses,
    number: Math.round(student.records.elective_credits / passing_condition.elective_courses * 100).toString()
  }
  let totalCredits = {
    text: student.records.total_credits + "/" + parseInt(passing_condition.core_courses + passing_condition.required_courses + passing_condition.elective_courses),
    number: Math.round(student.records.total_credits / (parseInt(passing_condition.core_courses + passing_condition.required_courses + passing_condition.elective_courses)) * 100).toString()
  }
  let gpa = student.records.egci_cumulative_gpa
  let messages = {
    replyToken,
    messages: [{
      type: "flex",
      altText: "flex message",
      contents: {
        type: "bubble",
        size: "giga",
        direction: "ltr",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          backgroundColor: "#FFFFFFFF",
          contents: [{
            type: "text",
            text: "Student's Info",
            size: "xl",
            color: "#3C84FBFF",
            contents: []
          }, {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            margin: "lg",
            backgroundColor: "#FFFFFFFF",
            contents: [{
              type: "box",
              layout: "baseline",
              contents: [{
                type: "text",
                text: "Name",
                size: "sm",
                color: "#AAAAAA",
                flex: 1,
                align: "start",
                wrap: true,
                contents: []
              }, {
                type: "text",
                text: studentName,
                size: "sm",
                color: "#666666",
                flex: 2,
                align: "start",
                wrap: true,
                contents: []
              }]
            }, {
              type: "box",
              layout: "baseline",
              contents: [{
                type: "text",
                text: "Student ID",
                size: "sm",
                color: "#AAAAAA",
                flex: 1,
                align: "start",
                margin: "none",
                wrap: true,
                contents: []
              }, {
                type: "text",
                text: studentID,
                size: "sm",
                color: "#666666",
                flex: 2,
                align: "start",
                wrap: true,
                contents: []
              }]
            }, {
              type: "box",
              layout: "baseline",
              contents: [{
                type: "text",
                text: "Advisor",
                size: "sm",
                color: "#AAAAAA",
                flex: 1,
                contents: []
              }, {
                type: "text",
                text: advisor,
                size: "sm",
                color: "#666666",
                flex: 2,
                wrap: true,
                contents: []
              }]
            }, {
              type: "box",
              layout: "baseline",
              contents: [{
                type: "text",
                text: "Entry",
                size: "sm",
                color: "#AAAAAA",
                flex: 1,
                contents: []
              }, {
                type: "text",
                text: entry,
                size: "sm",
                color: "#666666",
                flex: 2,
                contents: []
              }]
            }, {
              type: "box",
              layout: "baseline",
              contents: [{
                type: "text",
                text: "Email",
                size: "sm",
                color: "#AAAAAA",
                flex: 1,
                contents: []
              }, {
                type: "text",
                text: email,
                size: "sm",
                color: "#666666",
                flex: 2,
                wrap: true,
                contents: []
              }]
            }, {
              type: "box",
              layout: "baseline",
              contents: [{
                type: "text",
                text: "Phone",
                size: "sm",
                color: "#AAAAAA",
                flex: 1,
                contents: []
              }, {
                type: "text",
                text: phone,
                size: "sm",
                color: "#666666",
                flex: 2,
                contents: []
              }]
            }]
          }]
        }
      }
    }, {
      type: "flex",
      altText: "flex message",
      contents: {
        type: "carousel",
        contents: [{
          type: "bubble",
          size: "nano",
          direction: "ltr",
          body: {
            type: "box",
            layout: "vertical",
            contents: [{
              type: "text",
              text: "GPA",
              weight: "regular",
              size: "md",
              align: "center",
              margin: "sm",
              contents: []
            }, {
              type: "text",
              text: gpa,
              weight: "regular",
              size: "xl",
              color: "#3C84FBFF",
              align: "center",
              margin: "sm",
              contents: []
            }]
          }
        }, {
          type: "bubble",
          size: "nano",
          direction: "ltr",
          body: {
            type: "box",
            layout: "vertical",
            contents: [{
              type: "text",
              text: "Total",
              weight: "regular",
              size: "md",
              align: "start",
              margin: "sm",
              contents: []
            }, {
              type: "text",
              text: totalCredits.text,
              weight: "regular",
              size: "xxs",
              color: "#AAAAAA",
              align: "end",
              margin: "lg",
              contents: []
            }, {
              type: "box",
              layout: "vertical",
              backgroundColor: "#D5D5D5FF",
              cornerRadius: "3px",
              contents: [{
                type: "box",
                layout: "vertical",
                width: totalCredits.number + "%",
                height: "6px",
                backgroundColor: "#3C84FBFF",
                borderColor: "#FFFFFFFF",
                cornerRadius: "3px",
                contents: [{
                  type: "filler"
                }]
              }]
            }]
          }
        }, {
          type: "bubble",
          size: "nano",
          direction: "ltr",
          body: {
            type: "box",
            layout: "vertical",
            contents: [{
              type: "text",
              text: "Core",
              weight: "regular",
              size: "md",
              align: "start",
              margin: "sm",
              contents: []
            }, {
              type: "text",
              text: passing_core.text,
              weight: "regular",
              size: "xxs",
              color: "#AAAAAA",
              align: "end",
              margin: "lg",
              contents: []
            }, {
              type: "box",
              layout: "vertical",
              backgroundColor: "#D5D5D5FF",
              cornerRadius: "3px",
              contents: [{
                type: "box",
                layout: "vertical",
                width: passing_core.number + "%",
                height: "6px",
                backgroundColor: "#3C84FBFF",
                borderColor: "#FFFFFFFF",
                cornerRadius: "3px",
                contents: [{
                  type: "filler"
                }]
              }]
            }]
          }
        }, {
          type: "bubble",
          size: "nano",
          direction: "ltr",
          body: {
            type: "box",
            layout: "vertical",
            contents: [{
              type: "text",
              text: "Major",
              weight: "regular",
              size: "md",
              align: "start",
              margin: "sm",
              contents: []
            }, {
              type: "text",
              text: passing_major.text,
              weight: "regular",
              size: "xxs",
              color: "#AAAAAA",
              align: "end",
              margin: "lg",
              contents: []
            }, {
              type: "box",
              layout: "vertical",
              backgroundColor: "#D5D5D5FF",
              cornerRadius: "3px",
              contents: [{
                type: "box",
                layout: "vertical",
                width: passing_major.number + "%",
                height: "6px",
                backgroundColor: "#3C84FBFF",
                borderColor: "#FFFFFFFF",
                cornerRadius: "3px",
                contents: [{
                  type: "filler"
                }]
              }]
            }]
          }
        }, {
          type: "bubble",
          size: "nano",
          direction: "ltr",
          body: {
            type: "box",
            layout: "vertical",
            contents: [{
              type: "text",
              text: "Elective",
              weight: "regular",
              size: "md",
              align: "start",
              margin: "sm",
              contents: []
            }, {
              type: "text",
              text: passing_elective.text,
              weight: "regular",
              size: "xxs",
              color: "#AAAAAA",
              align: "end",
              margin: "lg",
              contents: []
            }, {
              type: "box",
              layout: "vertical",
              backgroundColor: "#D5D5D5FF",
              cornerRadius: "3px",
              contents: [{
                type: "box",
                layout: "vertical",
                width: passing_elective.number + "%",
                height: "6px",
                backgroundColor: "#3C84FBFF",
                borderColor: "#FFFFFFFF",
                cornerRadius: "3px",
                contents: [{
                  type: "filler"
                }]
              }]
            }]
          }
        }]
      }
    }]
  }
  return rawReply(messages)
}

// exports.getMembers = async(replyToken, lineUID) => {

//   const student = await Student.findOne({
//     lineUID: lineUID
//   }).catch((err) => {
//     console.log(err.message)
//   })
// }

function capitalize(name) {
  let words = []
  name.split(' ').forEach((word) => {
    words.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  })
  // console.log(words.join(' '))
  return words.join(' ')
}

function toString(object) {
  Object.keys(object).forEach(key => {
    if (typeof object[key] === 'object') {
      return toString(object[key]);
    }
    object[key] = capitalize('' + object[key]);
  });
  return object;
}