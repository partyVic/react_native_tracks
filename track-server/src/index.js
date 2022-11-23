const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const trackRoutes = require('./routes/trackRoutes')
const requireAuth = require('./middlewares/requireAuth')

dotenv.config()
connectDB()
const app = express()

app.use(express.json()) // allow us to accept JSON data in the req.body

// used for show the log of requests. Put before any route handlers
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


app.use(authRoutes)
app.use(trackRoutes)

app.get('/', requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`)
})


const PORT = process.env.PORT || 5000
app.listen(
    PORT,
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)