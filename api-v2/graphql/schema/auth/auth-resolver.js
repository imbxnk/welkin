const User = require('../../../models/user')
const ErrorHandler = require('../../../utils/errorHandlers')
const sendToken = require('../../../utils/jsonWebToken')
const sendEmail = require('../../../utils/send_email')
const crypto = require('crypto')

module.exports = {
    Query : {
        // Logout user
        logout : async (_, args, { req, res }) => {
            // Check If User is Logged In
            if(!req.isAuth) throw new ErrorHandler(`Please Login to perform this action`, 400)
            
            console.log(`👋 [${req.user.username}] Logout. Bye!`)

            // Clear Req User
            delete req.user
            delete req.isAuth

            // Clear cookie and set expired
            res.cookie('token', 'none', {
                expires : new Date(Date.now()),
                httpOnly : true
            })
            return { token : '', userId : '', message : 'Logout successful.' }
        },
    },

    Mutation : {
        login : async (_, { username, password }, { req, res }) => {
            // Check if username / password is empty
            if (!username || !password) throw new ErrorHandler(`Please enter username and password`, 400)
            
            // Authentication
            const user = await User.findOne({username}).select('+password')         // Get User from Database
            if(!user) {
                console.log(`🛑 [${username}] Attemp to Login (Username not found)`)  // Logs
                throw new ErrorHandler(`Invalid Username or Password`, 400)
            }
            const isPasswordMatched = await user.comparePassword(password)          // Check Password with Database
            if (!isPasswordMatched) {
                console.log(`🛑 [${username}] Attemp to Login (Wrong Password)`)  // Logs
                throw new ErrorHandler(`Invalid Username or Password`, 400)
            }
            console.log(`✔️  [${username}] Login successful!`)  // Logs
            return sendToken(user, req, res, 'Login Successful !')     // Send Token
        },
        createUser : async (_, { userInput }, { req, res }) => {
            // Generate Username If username is empty
            if (!userInput.username) {
                const { given_name, family_name } = userInput
                // Automatically create Username according to the pattern 'firstname.las'
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
            console.log(`✔️  User [${user.username}] has been created!`)  // Logs
            return sendToken(user, req, res, 'User has been created')
        }
    }
}