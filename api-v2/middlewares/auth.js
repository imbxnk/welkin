const JWT = require('jsonwebtoken')
const User = require('../models/user')
const ErrorHandler = require('../utils/errorHandlers')

// Check Authenticated User
exports.isAuthenticated = async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token) {
        return next(new ErrorHandler('Unauthorized.', 401))
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next()
}

// Handling Users Groups
exports.authorizedGroups = (...groups) => {
    return (req, res, next) => {
        if(!groups.includes(req.user.group)) {
            return next(new ErrorHandler('Unauthorized.', 401));
        }
        next();
    }
}