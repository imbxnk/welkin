const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const dotenv = require('dotenv')
dotenv.config({path: './config/.env'})

// HTTPS
const fs = require('fs')
const https = require('https')
const privateKey  = fs.readFileSync(process.env.SSL_KEY, 'utf8')
const certificate = fs.readFileSync(process.env.SSL_CERT, 'utf8')
const credentials = {key: privateKey, cert: certificate}

// mongo
const MongoClient = require('mongodb').MongoClient

// Push Message
const line = require('@line/bot-sdk');
const client = new line.Client({
  channelAccessToken: process.env.CHANNEL_TOKEN
});


// Start listening to PORT
const PORT = process.env.PORT
const httpsServer = https.createServer(credentials, app)
const server = httpsServer.listen(PORT, () => {
    console.log(`🚀 Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

app.post('/webhook', (req,res) => {
  console.log("USERID:  " + req.body.events[0].source.userId)
  console.log("TYPE: " + req.body.events[0].message.type)
  console.log("MESSAGE: " + req.body.events[0].message.text)
  let reply_token = req.body.events[0].replyToken

  let msg
  if(req.body.events[0].message.type == "text"){
    msg = req.body.events[0].message.text
  }else{
    // ทำต่อด้วย
    msg = "" 
  }
  reply(reply_token,msg)
  
  res.status(200).send('Hello')
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

async function reply(reply_token,msg) {
  let words = msg.split(" ")
  if(words[0] == 'lookup'){
    // msg = 'lookup for sid...'
    msg = await lookup(words)
    console.log("MSG: "+msg);
    
  }else if(words[0] == 'register'){
    msg = 'register new student'
  }
  // switch(words[0]){
  //   case "lookup":await lookup(words);break;
  //   default: break;
  // }
  let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CHANNEL_TOKEN}`
  }
  let body = JSON.stringify({
      replyToken: reply_token,
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
  });
}

async function lookup(words){
  let result
  if(words[1]){
    console.log(getLookupData("students",words[1],words[2]))
    return getLookupData("students",words[1],words[2]);
  }
  // console.log(result);
  
  return ""
  // switch(words[1]){
  //   case "sid":getLookupData("students",words[1],words[2]);break;
  //   default:break;
  // }
}

function getLookupData(collection,keyword,value){
  var url = "mongodb://localhost:27017/";
  let result
  return MongoClient.connect(url, { useUnifiedTopology: true }, function(err,db){
    if(err) throw err
    var dbo = db.db("welkin_v2")
    var query = {[keyword]:value}
    return dbo.collection(collection).findOne(query,function(err,res){
      if(err) throw err
      console.log("getLookUp: "+res.given_name + " " + res.family_name)
      return result = res.given_name + " " + res.family_name
    })
    // db.close()
    // return result
  })
}

// for (var i = 0;i<100;i++){
//   pushMessage();
// }

function pushMessage(){
  //push message
  const message = {
    type: 'text',
    text: 'คุณโดนล่อแล้ว'
  };
  
  client.pushMessage('U2dd24ef8c26321eb3f170fef9555b7d5', message)
  .then(() => {
    console.log(res);
  })
  .catch((err) => {
    // error handling
  });
}
