const express = require('express')
const bodyParser = require('body-parser')
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

// Utils
const stdUtils = require('./utils/students')
const usrUtils = require('./utils/users')
const courseUtils = require('./utils/course')

// Push Message
const line = require('@line/bot-sdk');
const { reply } = require('./utils/line-utils')
const client = new line.Client({
  channelAccessToken: process.env.CHANNEL_TOKEN
});

// Start listening to PORT
const PORT = process.env.PORT
const httpsServer = https.createServer(credentials, app)
const server = httpsServer.listen(PORT, () => {
    console.log(`🚀 LINE Webhook Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

// Webhook for LINE + Dialogflow
app.post('/webhook', async (req,res) => {
  try {
    console.log("===========================================");
    // console.log(req.body)
    // console.log(req.body.queryResult.parameters)
    // console.log(req.body.originalDetectIntentRequest.payload.data)

    // Parse data from Dialogflow
    const originalMsg = req.body.originalDetectIntentRequest.payload.data
    const intentId = req.body.queryResult.intent.name.split("/").pop()
    let parameters = req.body.queryResult.parameters
    
    console.log(intentId)

    // Check Intent ID
    switch(intentId) {
      // New Register Intent
      case "69c6b1d6-3ad3-4cac-9105-d8377d6b41fc":
        // Check Whether this LINE Account has been registered
        if (await stdUtils.checkRepeatedRegistration(originalMsg.replyToken, originalMsg.source.userId)) {
          return res.send(JSON.stringify({
            "followupEventInput": {
              "name": "register-get-studentIDandFullName",
              "languageCode": "en-US",
            }
          }))
        }
        // Cancel Registration if this LINE Account has been registered with Welkin
        return res.send(JSON.stringify({
          "followupEventInput": {
            "name": "register-cancel",
            "languageCode": "en-US",
          }
        }))
        break
      // Check Full Name and Student ID
      case "e2d13920-6eb2-4cac-9d9e-f1f9ff5ec536":
        if (await stdUtils.checkStudentIDandFullName(originalMsg.replyToken, parameters)) {
          return res.send(JSON.stringify({
            "followupEventInput": {
              "name": "register-get-email",
              "parameters": {
                ...parameters
              },
              "languageCode": "en-US"
            }
          }))
        }
        // Cancel Registration if student not found or not matched with Full Name
        return res.send(JSON.stringify({
          "followupEventInput": {
            "name": "register-cancel",
            "languageCode": "en-US",
          }
        }))
        break
      // Validate Email
      case "23f549b6-e694-41b8-a64a-3d31a4ccd3e8":
        parameters = await stdUtils.validateEmail(parameters)
        if (parameters) {
          return res.send(JSON.stringify({
            "followupEventInput": {
              "name": "register-get-phone",
              "parameters": {
                ...parameters
              },
              "languageCode": "en-US",
            }
          }))
        }
        delete parameters.email
        // Reprompt
        return res.send(JSON.stringify({
          "followupEventInput": {
            "name": "register-get-email",
            "parameters": {
              ...parameters
            },
            "languageCode": "en-US",
          }
        }))
        break
      // Validate Phone Number
      case "c94a9052-fb83-40e4-879c-16ada0e17b7c":
        parameters = await stdUtils.validatePhone(parameters)
        if (parameters) {
          await stdUtils.sendConfirmation(originalMsg.replyToken, parameters)
          console.log("TEST CHALLENGE")
          res.send(JSON.stringify({
            "followupEventInput": {
              "name": "register-get-confirmation",
              "parameters": {
                ...parameters
              },
              "languageCode": "en-US",
            }
          }))

          return
        }
        delete parameters.phone
        // Reprompt
        return res.send(JSON.stringify({
          "followupEventInput": {
            "name": "register-get-phone",
            "parameters": {
              ...parameters
            },
            "languageCode": "en-US",
          }
        }))
        break
      // Student Register Intent
      case "029dbe1b-1c3b-485f-8e5b-dae136666217": // latest
        if(parameters.confirmation.toLowerCase() === "confirm")
          await stdUtils.register(originalMsg.replyToken, originalMsg.source.userId, parameters)
        else res.send(JSON.stringify({
                "followupEventInput": {
                  "name": "register-get-confirmation",
                  "parameters": {
                    ...parameters
                  },
                  "languageCode": "en-US",
                }
              }))
        break
      // Instructor Register Intent
      case "":
        break

      // =========================================================================================
      // =========================================================================================
      // Look up
      case "0ba5f5cb-2c6f-4569-ac68-fde2f239196b":
        // This function only allow instructors
        await stdUtils.sendFilterOptions(originalMsg.replyToken,originalMsg.source.userId)
        return res.send(JSON.stringify({
          "followupEventInput": {
            "name": "lookup-get-filter",
            "languageCode": "en-US",
          }
        }))
        break
      // Get filter
      case "39ff94d9-4c5a-4794-966b-e945f4da47c4":
        switch(parameters.filter){
          case "studentID":
            return res.send(JSON.stringify({
              "followupEventInput": {
                "name": "lookup-by-studentID",
                "languageCode": "en-US",
              }
            }))
            break
          case "studentName":
            return res.send(JSON.stringify({
              "followupEventInput": {
                "name": "lookup-by-name",
                "languageCode": "en-US",
              }
            })) 
            break
          case "courseCode":
            return res.send(JSON.stringify({
              "followupEventInput": {
                "name": "lookup-by-coursecode",
                "languageCode": "en-US",
              }
            })) 
            break
        }
        break
      // Lookup by studentID
      case "9203a24c-9b63-4ef6-a88b-aef08aab94b4":
        await stdUtils.getStudentInfo(originalMsg.replyToken, parameters)
        break
      // Lookup by student name
      case "58fdea74-2799-4f86-ad5e-f284073d2d65":
        await stdUtils.getStudentInfo(originalMsg.replyToken, parameters)
        break
      // Lookup by course code
      case "3af5fa94-8da0-4e32-8437-abb3f13836e7":
        await courseUtils.getCourseInfo(originalMsg.replyToken, parameters)
        break


      // Default Fallback
      case "8d0cdd43-cb62-4f66-9eb4-9e4660cab805":
        let roomId = originalMsg.source.roomId || originalMsg.source.groupId
        let roomType = originalMsg.source.type
        let userId = originalMsg.source.userId
        let message = originalMsg.message.text

        switch (message) {
          case "info":

            break
        }
        console.log(roomId, userId)
        break
    }
  } catch(err) {
    console.log(err)
  }
})

// Handling Unhandled Promise Rejection
process.on('unhandledRejection', err => {
  console.log(`🔥 Error: ${err.message}`)
  console.log(`🔥 Shutting down the server due to handled promise rejection.`)
  server.close( () => {
      process.exit(1)
  })
})