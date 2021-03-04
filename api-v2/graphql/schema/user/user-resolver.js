const User = require('../../../models/user')
const ErrorHandler = require('../../../utils/errorHandlers')

module.exports = {
    Query : {
        user : async (_, { userInput }) => {
            let user = await User.find({ userInput })
            return { ...user._doc, _id : students._id.toString() }
        }
    },

    Mutation : {
        
    }
}