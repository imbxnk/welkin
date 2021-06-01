const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const dotenv = require('dotenv')
dotenv.config({path: './config/.env'})

// Connect to MongoDB
require('./config/database')()

// HTTPS
const fs = require('fs')
const https = require('https')
const privateKey  = fs.readFileSync(process.env.SSL_KEY, 'utf8')
const certificate = fs.readFileSync(process.env.SSL_CERT, 'utf8')
const credentials = {key: privateKey, cert: certificate}

// // mongo
// const MongoClient = require('mongodb').MongoClient

// Push Message
const line = require('@line/bot-sdk');
const client = new line.Client({
  channelAccessToken: process.env.CHANNEL_TOKEN
});

// Start listening to PORT
const PORT = process.env.PORT
const httpsServer = https.createServer(credentials, app)
const server = httpsServer.listen(PORT, () => {
    console.log(`🚀 LINE Webhook Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

const axios = require('axios')

app.post('/webhook', (req,res) => {
  console.log("===========================================");
  console.log(req.body)
  console.log(req.body.queryResult.parameters)
  console.log(req.body.originalDetectIntentRequest.payload.data)
  let studentID = req.body.queryResult.parameters.studentID
  let fullName = req.body.queryResult.parameters.fullName
  let email = req.body.queryResult.parameters.email
  let phone = req.body.queryResult.parameters.phone
  let replyToken = req.body.originalDetectIntentRequest.payload.data.replyToken
  // replyRegister(replyToken,{ studentID, fullName, email, phone})




  // return axios.post("https://dialogflow.cloud.google.com/v1/integrations/line/webhook/249b2c3d-be45-424a-8311-a540eb9e62d9",req.body)
  // .then((res)=>{
  //   // console.log(res)
  // }).catch((err)=>{
  //   // console.log(err.response.data)
  // })
  // switch(req.body.events[0].type){
  //   case "follow": // When user adds or unblocks Welkin bot
  //     break
  //   case "unfollow": // When user block Welkin bot
  //     break
  //   case "join": // When Welkin joins the group
  //     break
  //   case "leave": // When Welkin leaves or is kicked from the group
  //     break
  //   case "memberJoined": // When new user joins group or room while Welkin is already a member of that group
  //     break
  //   case "memberLeft": // When new user leaves group or room Welkin is already a member of that group (we can get their uid and mark as in-active so we don't need to send them some message)
  //     break
  //   case "message": // When user send any message
  //     console.log("USERID:  " + req.body.events[0].source.userId)
  //     console.log("TYPE: " + req.body.events[0].message.type)
  //     let replyToken = req.body.events[0].replyToken
    
  //     let msg = ""
  //     // if(req.body.events[0] == "")
  //     if(req.body.events[0].message.type == "text"){
  //       console.log("MESSAGE: " + req.body.events[0].message.text)
  //       msg = req.body.events[0].message.text
  //       let helpMsg = "Lookup student's info\n - lookup id '608xxxx'\n - lookup name 'Kanin'\n\n Lookup course's info\n - lookup course 'EGCIxxx'"
  //       let faqMsg = "INTERN\n - blablabla\n\nGRADUATION\n - blablabla\n\nCO-OP\n - blablabla"
  //       switch(msg.split(' ')[0].toLowerCase()){
  //         case "lookup":
  //           lookUp(replyToken, msg.trim())
  //           break
  //         case "help":
  //           reply(replyToken,helpMsg)
  //           break
  //         case "faq":
  //           reply(replyToken, faqMsg)
  //           break
  //         case "register":
  //           return axios.post("https://dialogflow.cloud.google.com/v1/integrations/line/webhook/249b2c3d-be45-424a-8311-a540eb9e62d9",req.body)
  //           .then((res)=>{
  //             console.log(res)
  //           }).catch((err)=>{
  //             // console.log(err.response.data)
  //           })
  //       }
  //     }else if(req.body.events[0].message.type == "sticker"){
  //       console.log("stickerId: " + req.body.events[0].message.stickerId)
  //       console.log("packageId: " + req.body.events[0].message.packageId)
  //       console.log("stickerResourceType id: " + req.body.events[0].message.stickerResourceType)
  //       console.log("keywords: ")
  //       console.log(req.body.events[0].message.keywords)
  //       push(req.body.events[0].source.userId)
  //     }
  //     break
  // }
  // res.status(200).send('Hello')
})

// Show "Not Found" if route does not exist
app.all('*', function(req, res){
  res.setHeader('content-type', 'text/plain')
  res.status(404).send('Not Found')
})


// Handling Unhandled Promise Rejection
process.on('unhandledRejection', err => {
  console.log(`🔥 Error: ${err.message}`)
  console.log(`🔥 Shutting down the server due to handled promise rejection.`)
  server.close( () => {
      process.exit(1)
  })
})

// Import Mongoose Schema(s)
const Student = require('./models/student')
const Course = require('./models/course')
const Instructor = require('./models/instructor')

// LookUp Function
async function lookUp(replyToken, msg) {
  // Split Message
  let args = splitWithTail(msg, ' ', 2)
  // CHECK FORMAT [cmd] [arg1] [arg2]
  if(args.length === 3) {
    let result
    switch(args[0].toLowerCase()) {
      // Get Student Information
      case "lookup":
        switch (args[1].toLowerCase()) {
          // Using Student ID
          case "id":
            result = await getStudents(args[1].toLowerCase(), args[2])
            reply(replyToken, result)
            break
          case "name":
            result = await getStudents(args[1].toLowerCase(), args[2])
            reply(replyToken, result)
            break
          // Find by status
          // case "status":
          //   result = await 
          //   break

          case "course":
            result = await getCourse(args[1].toLowerCase(), args[2])
            reply(replyToken, result)
            break
        }
        break
    }
  }
}




// ADD FUNCTION BELOW HERE @KANIN eg. getCourse getClass etc.
// v v v v v v v v v v v v v v v v v v v v v v v v v v v v v v
// v v v v v v v v v v v v v v v v v v v v v v v v v v v v v v

// Get Students Info
async function getStudents(arg, input) {
  switch(arg) {
    // Get by ID
    case "id":
      const student_id = await Student.findOne({ sid: input })
      .populate({
        path: 'advisor',
      })
      if (!student_id) return `Student (sid: ${input}) not found`
      let result_sid = student_id._doc
      return `StudentID: ${result_sid.sid}\nProgram: ${result_sid.program}\nPrefix: ${result_sid.prefix}\nName: ${result_sid.given_name}\nLastname: ${result_sid.family_name}\nAdvisor: ${result_sid.advisor.name}\n\nGPA: ${result_sid.records.egci_cumulative_gpa}\nCore Credits: ${result_sid.records.core_credits}\nMajor Credits: ${result_sid.records.major_credits}\nElective Credits: ${result_sid.records.elective_credits}\nTotal Credits: ${result_sid.records.total_credits}`
    case "name":
      input = input.charAt(0).toUpperCase()+input.slice(1)
      const student_name = await Student.findOne({ given_name: input })
      if (!student_name) return `Student (name: ${input}) not found`
      let result_sname = student_name._doc
      return `StudentID: ${result_sname.sid}\nProgram: ${result_sname.program}\nPrefix: ${result_sname.prefix}\nName: ${result_sname.given_name}\nLastname: ${result_sname.family_name}\nAdvisor: ${result_sid.advisor.name}\n\nGPA: ${result_sname.records.egci_cumulative_gpa}\nCore Credits: ${result_sname.records.core_credits}\nMajor Credits: ${result_sname.records.major_credits}\nElective Credits: ${result_sname.records.elective_credits}\nTotal Credits: ${result_sname.records.total_credits}`
  }
}

// Get Course Info
async function getCourse(arg, input){
  switch(arg){
    // Get by code
    case "course":
      const course_code = await Course.findOne({ code: input })
      if (!course_code) return `Course (code: ${input}) not found`
      let result_course_code = course._doc
      return `CourseCode: ${result_course_code.code}\nName: ${result_course_code.name}\nCategory: ${result_course_code.category}\nCredit: ${result_course_code.credit}\nDescription: ${result_course_code.description}`
  }
}

// Get Students Info
// async function getStatus(arg, input){
//   switch(arg){
//     // Get by status
//     case "behind":

//   }
// }

// async function getRecords(arg, input){
//   switch
// }

// Register students with student ids
async function register(replyToken, uid, msg){
  let args = splitWithTail(msg.trim(), ' ', 2)
  console.log(args[2])

  if(args.length < 3 || !args[2]) return reply(replyToken, "Invalid registration format. \nregister [student id] [full name]")
  let sid = args[1]
  let name = args[2].toLowerCase()
  let student_register = await Student.findOne({ sid: sid })
  if(!student_register) return reply(replyToken, "StudentID not found!")
  let checkedName = student_register.given_name + " " + student_register.family_name
  if (name !== checkedName.toLowerCase()) return reply(replyToken, `Incorrect Name of Student ID ${sid}`)
  student_register.lineUID = uid

  await student_register.save()
  .then(reply(replyToken,"UID: "+student_register.lineUID+" is successfully registered"))
  .catch( err => { return reply(replyToken,err) })
}

// ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ
// ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ ʌ
// ADD FUNCTION ABOVE HERE @KANIN eg. getCourse getClass etc.


// Reply register
function replyRegister(replyToken,{ studentID, fullName, email, phone}){
  let headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.CHANNEL_TOKEN}`
}
let body = JSON.stringify({
    replyToken,
    messages: [{
        type: 'flex',
        contents: { 
          "type": "bubble",
          "hero": {
            "type": "image",
            "size": "full",
            "aspectRatio": "2:1",
            "aspectMode": "cover",
            "url": "https://cdn.welkin.app/static/img/line-registration-flex-cover.png"
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "Registration",
                "weight": "bold",
                "size": "xl"
              },
              {
                "type": "text",
                "text": "Please make sure the information is correct",
                "margin": "none",
                "size": "xs",
                "color": "#999999"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Student ID",
                        "color": "#aaaaaa",
                        "size": "sm",
                        "flex": 2
                      },
                      {
                        "type": "text",
                        "text": studentID,
                        "wrap": true,
                        "color": "#666666",
                        "size": "sm",
                        "flex": 4
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Full Name",
                        "color": "#aaaaaa",
                        "size": "sm",
                        "flex": 2
                      },
                      {
                        "type": "text",
                        "text": fullName,
                        "wrap": true,
                        "color": "#666666",
                        "size": "sm",
                        "flex": 4
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Email",
                        "color": "#aaaaaa",
                        "size": "sm",
                        "flex": 2
                      },
                      {
                        "type": "text",
                        "text": email,
                        "wrap": true,
                        "color": "#666666",
                        "size": "sm",
                        "flex": 4
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Phone",
                        "color": "#aaaaaa",
                        "size": "sm",
                        "flex": 2
                      },
                      {
                        "type": "text",
                        "text": phone,
                        "wrap": true,
                        "color": "#666666",
                        "size": "sm",
                        "flex": 4
                      }
                    ]
                  }
                ]
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "horizontal",
            "spacing": "sm",
            "contents": [
              {
                "type": "button",
                "style": "link",
                "height": "sm",
                "action": {
                  "type": "message",
                  "label": "Cancel",
                  "text": "Cancel"
                },
                "color": "#00000099"
              },
              {
                "type": "button",
                "style": "link",
                "height": "sm",
                "action": {
                  "type": "message",
                  "label": "Confirm",
                  "text": "Confirm"
                },
                "color": "#007bff"
              },
              {
                "type": "spacer",
                "size": "sm"
              }
            ],
            "flex": 0
          }
        }
    }]
})
request.post({
    url: 'https://api.line.me/v2/bot/message/reply',
    headers: headers,
    body: body
}, (err, res, body) => {
    console.log('status = ' + res.statusCode);
    console.log(res)
});
}

// Function to reply message
function reply(replyToken,msg) {
  let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CHANNEL_TOKEN}`
  }
  let body = JSON.stringify({
      replyToken,
      messages: [{
          type: 'text',
          text: msg
      }]
  })
  request.post({
      url: 'https://api.line.me/v2/bot/message/reply',
      headers: headers,
      body: body
  }, (err, res, body) => {
      console.log('status = ' + res.statusCode);
      console.log(res)
  });
}

// Function to Push messsage
function push(uid) {
  let headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.CHANNEL_TOKEN}`
  }
  let body = JSON.stringify({
    to: uid,
    messages: [
      {
        type: "flex",
        altText: "This is a Flex Message",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "text",
                text: "Hello,"
              },
              {
                type: "text",
                text: "World!"
              }
            ]
          }
        }
      }
    ]
  })
  request.post({
    url: 'https://api.line.me/v2/bot/message/push',
    headers: headers,
    body: body
  }, (err, res, body) => {
    console.log('status = ' + res.statusCode);
  });
}

// Split Message
function splitWithTail(str, delim, count) {
  var parts = str.split(delim)
  var tail = parts.slice(count).join(delim)
  var result = parts.slice(0,count)
  result.push(tail)
  return result
}