const User = require('../../../models/user')
const ErrorHandler = require('../../../utils/errorHandlers')
const sendToken = require('../../../utils/jsonWebToken')
const sendEmail = require('../../../utils/send_email')
const crypto = require('crypto')

module.exports = {
    Query : {
        
    },

    Mutation : {
        login : async (_, { username, password }, { res }) => {
            // Check if username / password is empty
            if (!username || !password) throw new ErrorHandler(`Please enter username and password`, 400)
            
            // Authentication
            const user = await User.findOne({username}).select('+password')         // Get User from Database
            if(!user) throw new ErrorHandler(`Invalid Username or Password`, 400)
            const isPasswordMatched = await user.comparePassword(password)          // Check Password
            if (!isPasswordMatched) throw new ErrorHandler(`Invalid Username or Password`, 400)

            return sendToken(user, res)     // Send Token
        },
        createUser : async (_, { userInput }, { res }) => {
            // Generate Username If username is empty
            if (!userInput.username) {
                const { given_name, family_name } = userInput
                // Automatically create Username according to 'firstname.las'
                let givenname = given_name.trim() + '.'
                let familyname = family_name.trim()
                userInput.username = givenname + familyname.substring(0,3)
                // If Lastname has more than or equal to 3 characters
                if(familyname.length >= 3) {
                    // Check if the username exists
                    let user = await User.findOne({username: userInput.username})
                    // If exist use => firstname.lat instead
                    while(user && familyname.length > 3) {
                        familyname = familyname.slice(0,2) + familyname.slice(3)
                        userInput.username = givenname + familyname.substring(0,3)
                        user = await User.findOne({username: userInput.username})
                    }
                }
            }

            // Check Secret Key When Creating Admin Account
            if (userInput.group === 'admin' && userInput.secret_key !== process.env.ADMIN_SECRET_KEY) throw new ErrorHandler(`Invalid secret key.`, 400)
            // Create User and Set Token
            const user = await User.create(userInput).catch( err => { throw new ErrorHandler(err.message, 400) })
            return sendToken(user, res)
        }
    }
}