const express = require('express')
const mongoose = require('mongoose')
const Track = require('../models/Track')
const requireAuth = require('../middlewares/requireAuth')

const router = express.Router()

// all the routes define here will require the user to be sign in
//! after user loggin will get the value of req.user = user from requireAuth.js 
router.use(requireAuth)

router.get('/tracks', async (req, res) => {

    //! req.user can be used here
    const tracks = await Track.find({ userId: req.user._id })

    res.send(tracks)
})


router.post('/tracks', async (req, res) => {
    const { name, locations } = req.body

    if (!name || !locations) {
        return res.status(422).send({ error: 'You must provede a name and locations' })
    }

    try {
        const track = await Track.create({
            name,
            locations,
            userId: req.user._id
        })

        res.send(track)
    } catch (err) {
        res.status(422).send({ error: err.message })
    }
})


module.exports = router