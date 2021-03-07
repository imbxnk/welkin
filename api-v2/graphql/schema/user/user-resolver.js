const User = require('../../../models/user')
const ErrorHandler = require('../../../utils/errorHandlers')

module.exports = {
    Query : {
        me : async (_, args, { req, res }) => {
            let user = await User.findById(req.user.id)
            return { ...user._doc, _id : user._id.toString() }
        }
    },

    Mutation : {
        
    }
}