const axios = require('axios')

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.CHANNEL_TOKEN}`
}

exports.getUserProfile = async (userId) => {
  return axios.get(`https://api.line.me/v2/bot/profile/${userId}`, { headers})
    .then((res) => {
      return res.data
    })
    .catch((err) => { console.log(err) })
}

exports.rawReply = async (messages) => {
  const body = JSON.stringify(messages)
  await axios.post("https://api.line.me/v2/bot/message/reply", body, { headers }).catch(err => { console.log(err) })
}

exports.reply = async (replyToken, text) => {
  const body = JSON.stringify({
    replyToken,
    messages: [
      {
        type: 'text',
        text
      }
    ]
  })
  await axios.post("https://api.line.me/v2/bot/message/reply", body, { headers }).catch(err => { console.log(err) })
}

exports.replies = async (replyToken, texts) => {
  let messages = []
  texts.forEach((text) => {
    messages.push({
      type: 'text',
      text
    })
  })
  const body = {
    replyToken,
    messages
  }
  await axios.post("https://api.line.me/v2/bot/message/reply", body, { headers }).catch(err => { console.log(err) })
}

exports.pushMessage = async (to, text) => {
  const body = JSON.stringify({
    to,
    messages: [
      {
        type: 'text',
        text
      }
    ]
  })
  await axios.post("https://api.line.me/v2/bot/message/push", body, { headers }).catch(err => { console.log(err) })
}