const User = require('../../../models/user')
const ErrorHandler = require('../../../utils/errorHandlers')
const sendToken = require('../../../utils/sendToken')
const { authorizedGroups } = require('../../../utils/authorizedGroups')

const { GraphQLUpload } = require('apollo-server-express')
const fs = require('fs')
const sharp = require('sharp')

module.exports = {
    Upload: GraphQLUpload,

    Query: {
        me: async (_, args, { req, res }) => {
            /* ################### Check Authentication ################### */
            if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            /* ################### Check Authentication ################### */
            let user = await User.findById(req.user.id)
                .populate({
                    path: 'linked_instructor'
                })
                .populate({
                    path: 'remarks'
                })
                .catch( err => { throw new ErrorHandler(err.message, 400) })
            if (!user) throw new ErrorHandler('User Not Found.', 401)
            return { ...user._doc, _id : user._id.toString() }
        },
        users: async (_, args, { req, res }) => {
            /* ################### Check Authentication ################### */
            // if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            // authorizedGroups(['admin', 'coordinator'], req.user)
            /* ################### Check Authentication ################### */
            let users = await User.find({})
                .populate({
                    path: 'linked_instructor'
                })
                .populate({
                    path: 'remarks'
                })
                .catch( err => { throw new ErrorHandler(err.message, 400) })
                sortOrder = ['admin', 'coordinator', 'program director', 'lecturer']
                users.sort((a, b) => sortOrder.indexOf(a.group) - sortOrder.indexOf(b.group))
                users.sort((a, b) => {
                    if(a.isActive && b.isActive) return 0
                    else if (a.isActive && !b.isActive) return -1
                    return 1
                })
            return { total: users.length, users }
        }
    },

    Mutation: {
        createUser: async (_, { userInput }, { req, res }) => {
            /* ################### Check Authentication ################### */
            if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            authorizedGroups(['admin', 'coordinator'], req.user)
            /* ################### Check Authentication ################### */
            
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
            return { success: true, message: `User "${user.username}" has been created`}
        },
        updatePassword: async (_, { userInput }, { req, res }) => {
            /* ################### Check Authentication ################### */
            if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            /* ################### Check Authentication ################### */
            let user = await User.findById(req.user.id).select('+password').catch( err => { throw new ErrorHandler(err.message, 400) })
            // Check whether the password is matched
            const isMatched = await user.comparePassword(userInput.currentPassword)
            if(!isMatched) {
                return new ErrorHandler('Password is incorrect.', 401)
            }
            user.password = userInput.newPassword
            await user.save()
            return sendToken(user, req, res, 'Password has been changed.')
        },
        updateMyAccount: async (_, { userInput }, { req, res }) => {
            /* ################### Check Authentication ################### */
            if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            /* ################### Check Authentication ################### */

            // Get Current User
            let user = await User.findByIdAndUpdate(req.user.id, userInput).catch( err => { throw new ErrorHandler(err.message, 400) })
            return { success: true, message: 'Your account has been updated.' }
        },
        updateAccount: async (_, { id, userInput }, { req, res }) => {
            /* ################### Check Authentication ################### */
            if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            authorizedGroups(['admin', 'coordinator'], req.user)
            /* ################### Check Authentication ################### */

            // Get user from username
            let user = await User.findById(id).catch( err => { throw new ErrorHandler(err.message, 400) })
            if (!user) throw new ErrorHandler('User not found')

            // Check whether coordinator update admin user ?
            if (req.user.group === 'coordinator' && user.group === 'admin') throw new ErrorHandler('You are not allow to update ADMIN user')
            
            console.log(user)

            // Update User
            user = await User.findByIdAndUpdate(user._id, userInput, {
                new: true,
                runValidators: true,
                useFindAndModify: false
              }).catch(err => {
                throw new ErrorHandler(err.message, 500)
              })

            console.log(user)
            
            return user
        },
        updateAvatar: async (_, { file }, { req, res }) => {
            /* ################### Check Authentication ################### */
            if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            /* ################### Check Authentication ################### */
            // Get Current User
            let user = await User.findById(req.user.id).catch( err => { throw new ErrorHandler(err.message, 400) })
            if (!user) throw new ErrorHandler('User not found')

            if(Array.isArray(file)) {
                file = file[0]
            }

            return file.promise.then(async (file) => {
                try {
                    const {createReadStream, filename, mimetype} = file

                    // Check File Type
                    const acceptedFilesType = ['image/jpeg', 'image/png', 'image/gif']
                    if(!acceptedFilesType.includes(mimetype)) throw new ErrorHandler('This file type is not supported.')

                    const fileStream = createReadStream()
                    const path = process.env.FILES_UPLOAD_PATH
                    const new_filename = `${user._id}-${new Date().getTime()}`
                    const ext = `.${filename.split('.').slice(-1).pop()}`
                    // Add to storage
                    await fileStream.pipe(fs.createWriteStream(`${path}/${new_filename}-300x300${ext}`))

                    const readImg = fs.promises.readFile(`${path}/${new_filename}-300x300${ext}`);
                    const buffer = await Promise.resolve(readImg).then(function(buffer){
                        return buffer
                    })

                    // Image Compression
                    sharp(buffer)
                    .resize({
                        // fit: sharp.fit.contain,
                        width: 300,
                        height: 300
                    })
                    .flatten({ background: { r: 248, g: 249, b: 250 } })
                    .jpeg({ quality: 84 })
                    .toFile(`${path}/${new_filename}-300x300${ext}`)

                    // MEDIUM SIZE
                    sharp(buffer)
                    .resize({
                        // fit: sharp.fit.contain,
                        width: 180,
                        height: 180
                    })
                    .flatten({ background: { r: 248, g: 249, b: 250 } })
                    .jpeg({ quality: 82 })
                    .toFile(`${path}/${new_filename}-180x180${ext}`)

                    // SMALL SIZE
                    sharp(buffer)
                    .resize({
                        // fit: sharp.fit.contain,
                        width: 70,
                        height: 70
                    })
                    .flatten({ background: { r: 248, g: 249, b: 250 } })
                    .jpeg({ quality: 80 })
                    .toFile(`${path}/${new_filename}-70x70${ext}`)

                    let avatar = {}
                    avatar.large = `${process.env.AVATAR_DEFAULT_URL}/${new_filename}-300x300${ext}`
                    avatar.medium = `${process.env.AVATAR_DEFAULT_URL}/${new_filename}-180x180${ext}`
                    avatar.small = `${process.env.AVATAR_DEFAULT_URL}/${new_filename}-70x70${ext}`

                    user.avatar = avatar
                    await user.save()
                    
                    return { success: true, message: `Avatar has been upadted.`, avatar }
                } catch (err) {
                    console.log(err)
                    throw new ErrorHandler(err.message, 400)
                }
            }).catch((err) => {
                console.log(err)
                throw new ErrorHandler(err.message, 400)
            })            
        },
        
        deleteAvatar: async(_, { }, { req, res }) => {
            /* ################### Check Authentication ################### */
            if(!req.isAuth) throw new ErrorHandler('Not Authenticated.', 401)
            /* ################### Check Authentication ################### */

            // Get Current User
            let user = await User.findById(req.user.id).catch( err => { throw new ErrorHandler(err.message, 400) })
            if (!user) throw new ErrorHandler('User not found')

            user.avatar = {
                small: '',
                medium: '',
                large: ''
            }
            await user.save().catch((err) => { throw new ErrorHandler(err.message, 400) })
            return { success: true, message: 'Avatar has been deleted' }
        }
    }
}