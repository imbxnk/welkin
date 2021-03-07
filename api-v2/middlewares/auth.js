const JWT = require('jsonwebtoken')
const User = require('../models/user')
const ErrorHandler = require('../utils/errorHandlers')

// Check Authenticated User
exports.isAuthenticated = async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else {
        req.isAuth = false
        return next()
    }

    // if(!token) {
    //     throw new ErrorHandler('Not authenticated.', 401)
    // }

    let decoded
    try {
        decoded = JWT.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        req.isAuth = false
        return next()
    }

    if (!decoded) {
        req.isAuth = false
        return next()
    }
    
    req.user = await User.findById(decoded.id)
    req.isAuth = true

    next()
}