const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // mongoose v6 NOT require below anymore
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)

    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)         //exit with failure
    }
}

module.exports = connectDB