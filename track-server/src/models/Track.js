const mongoose = require('mongoose')

//! all the fields inside of pointSchema is the value come back from Reach Native mobile device 
const pointSchema = mongoose.Schema({
    timestamp: Number,
    coords: {
        latitude: Number,
        longitude: Number,
        altitude: Number,
        accuracy: Number,
        heading: Number,
        speed: Number
    }
})

const trackSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        default: ''
    },
    locations: [pointSchema]    //! pointSchema can be insert in here
})

const Track = mongoose.model('Track', trackSchema)

module.exports = Track