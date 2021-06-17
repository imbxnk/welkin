const WebConf = require('../../../models/web-conf')
const Announcement = require('../../../models/annnouncement')
const User = require('../../../models/user')
const student = require('../../../models/student')

const ErrorHandler = require('../../../utils/errorHandlers')
const { authorizedGroups } = require('../../../utils/authorizedGroups')
const { ObjectId } = require('mongodb')
const { getTrimester } = require('../../../utils/getTrimester')

module.exports = {
  Query: {
    config: async(_, { configInput }, { req, res }) => {
      /* ################### Check Authentication ################### */
      // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
      /* ################### Check Authentication ################### */
      let config = await WebConf.findOne().populate({
        path: 'announcements',
        match: {
          endDate: {
            $gt: new Date() // Get Only announcements that does not expire
          }
        },
        populate: {
          path: 'user'
        }
      })

      // Sort Announcement
      config.announcements.sort((a, b) => {
        return ~~b.createdAt - ~~a.createdAt
      })

      if (!config) throw new ErrorHandler(err.message, 400)
      
      return { ...config._doc, _id: config._id.toString(), current: getTrimester() }
    }
  },
  Mutation: {
    updateConfig: async (_, { configInput }, { req, res }) => {
      /* ################### Check Authentication ################### */
      // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
      // authorizedGroups(['admin', 'coordinator'], req.user)
      /* ################### Check Authentication ################### */

      // SORT BATCHES
      configInput.selectedBatches.sort()

      let config = await WebConf.findOne({})
      if (!config) {
        config = await WebConf.create(configInput).catch(err => { throw new ErrorHandler(err.message, 400)})
      } else {
        console.log(configInput)
        config = await WebConf.findOneAndUpdate({}, configInput, {
          new: true,
          useFindAndModify: false
        }).catch(err => {
          throw new ErrorHandler(`Failed to update config.`, 500)
        })
      }
      
      return { success: true, message: "" }
    },

    createAnnouncement: async (_, { announcementInput }, { req, res }) => {
      /* ################### Check Authentication ################### */
      if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
      authorizedGroups(['admin', 'coordinator'], req.user)
      /* ################### Check Authentication ################### */

      // Check User
      let user = await User.findById(req.user.id).catch( err => { throw new ErrorHandler(err.message, 400) })
      if(!user) throw new ErrorHandler(`User not found`, 404)
      announcementInput.user = req.user.id

      let config = await WebConf.findOne({}).catch(err => { throw new ErrorHandler(err.message, 400)})
      let announcement = await Announcement.create(announcementInput).catch(err => { throw new ErrorHandler(err.message, 400)})
      config.announcements.push(announcement)
      await config.save().catch(err => { throw new ErrorHandler(err.message, 400)})

      return { success: true, message: 'The announcement has been created'}
    }
  }
}