const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requireAuth = (req, res, next) => {

    // get the header info with Bearer token
    // authorization === 'Bearer json_web_token'
    const { authorization } = req.headers


    // if the request header does NOT include Authorization header
    if (!authorization) {
        return res.status(401).send({ error: 'You must be logged in.' })
    }

    //! this will get ONLY the token from the header
    // original: 'Bearer xxxxxx'
    // after replace: 'xxxxxx' ONLY the json web token
    const token = authorization.replace('Bearer ', '')

    //! verify the json web token
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: 'You must be logged in.' })
        }


        // payload is from below:
        // jwt.sign({ userId: user._id }
        const { userId } = payload


        // check if there is a valid user in mongoDB collection
        const user = await User.findById(userId)


        //! assign the user to the req object
        // So now we know exactly who made the request
        // this middleware is called with our incoming request
        // Chances are that some other request handlers inside of our application
        // might want to have some information about the given user.
        // So we'll attach that user model directly to that request object
        // so that any other request handler inside of our app can very easily get access to this user model.
        // So we'll take that user and we'll assign it to the req object on the user property.
        // And then after that we've done everything we need to do inside of our middleware.
        // So we will call next,
        req.user = user

        next()
    })
}

module.exports = requireAuth