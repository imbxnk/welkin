// Create and send token and save in cookie
const sendToken = (user, res) => {
    // Create Jason Web Token
    const token = user.getJwtToken()

    // Options for cookie
    const options = {
        expires : new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly : true
    };

    if(process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.cookie('token', token, options)

    return { token, userId : user._id.toString(), username : user.username }
}

module.exports = sendToken;