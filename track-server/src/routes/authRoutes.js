const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

router.post('/signup', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.create({
            email,
            password
        })

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d' // will expires in 30 days
        })

        res.send({ token })

    } catch (err) {
        //! remember to use return to end the execution of the code
        return res.status(422).send(err.message)
    }
})


router.post('/signin', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(422).send({ error: 'Must provide email and password' })
    }

    const user = await User.findOne({ email })

    if (!user) {
        return res.status(404).send({ error: 'Email not found' })
    }

    try {
        await user.comparePassword(password)

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d' // will expires in 30 days
        })

        res.send({ token })
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' })
    }

})

module.exports = router