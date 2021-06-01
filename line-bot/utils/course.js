const {
  reply,
  replies,
  rawReply,
  getUserProfile,
  pushMessage
} = require('./line-utils')
const validator = require('validator')

// Import Mongoose Schema(s)
const Course = require('../models/course')

exports.getCourseInfo = async (replyToken, searchInput) => {
  console.log('test')
  const course = await Course.findOne(searchInput)
  if (!course) return reply(replyToken, "Course not found.")
  let code = course.code
  let name = course.name
  let category = course.category
  let description = unescapeHtml(course.description)
  let credit = course.credit + "(" + course.credit_description.lecture + "-" + course.credit_description.lab + "-" + course.credit_description.self_study + ")"

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
          spacing: "sm",
          contents: [{
            type: "text",
            text: "Course Info",
            size: "xl",
            color: "#3C84FBFF",
            contents: []
          }, {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [{
              type: "box",
              layout: "horizontal",
              contents: [{
                type: "text",
                text: "Code",
                color: "#AAAAAA",
                flex: 1,
                gravity: "center",
                size: "sm",
                contents: []
              }, {
                type: "text",
                text: code,
                color: "#666666",
                flex: 3,
                contents: []
              }]
            }, {
              type: "box",
              layout: "horizontal",
              contents: [{
                type: "text",
                text: "Name",
                color: "#AAAAAA",
                flex: 1,
                gravity: "center",
                size: "sm",
                contents: []
              }, {
                type: "text",
                text: name,
                color: "#666666",
                flex: 3,
                wrap: true,
                contents: []
              }]
            }, {
              type: "box",
              layout: "horizontal",
              contents: [{
                type: "text",
                text: "Description",
                color: "#AAAAAA",
                flex: 1,
                size: "sm",
                contents: []
              }, {
                type: "text",
                text: description,
                color: "#666666",
                flex: 3,
                wrap: true,
                contents: []
              }]
            }, {
              type: "box",
              layout: "horizontal",
              contents: [{
                type: "text",
                text: "Category",
                color: "#AAAAAA",
                flex: 1,
                gravity: "center",
                size: "sm",
                contents: []
              }, {
                type: "text",
                text: category,
                color: "#666666",
                flex: 3,
                wrap: true,
                contents: []
              }]
            }, {
              type: "box",
              layout: "horizontal",
              contents: [{
                type: "text",
                text: "Credit",
                color: "#AAAAAA",
                flex: 1,
                gravity: "center",
                size: "sm",
                contents: []
              }, {
                type: "text",
                text: credit,
                color: "#666666",
                flex: 3,
                wrap: true,
                contents: []
              }]
            }]
          }]
        }
      }
    }]
  }

  return rawReply(messages)
}

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

function unescapeHtml(safe) {
  return safe.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}