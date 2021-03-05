// Create and send token and save in cookie
const sendToken = (user, res, message) => {
    // Create Jason Web Token
    const token = user.getJwtToken()

    // Options for cookie
    const options = {
        expires : new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        domain : '.welkin.app',
        httpOnly : true
    };

    if(process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.cookie('token', token, options)

    return { token, userId : user._id.toString(), message }
}

module.exports = sendToken;