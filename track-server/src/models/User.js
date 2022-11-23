const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        }

    },
    {
        timestamps: true
    }
)


// Before we make create/save action, run this middleware to encrypt the password
//! make sure to use function keyword, NOT arrow function ()=>
// inside of this function, the user instance,
// the user that we're trying to save is available as this keyword.
// If we make use of the arrow function inside of here,
// then the value of this will be changed to the context of this inside of this file,
// which is not what we want.
userSchema.pre('save', function (next) {
    const user = this

    //! Only do this if the password field is sent or it's modified
    // if we just update user name profile without changing password, don't run this middleware
    // use mongoose method isModified() to check if password has changed
    if (!user.isModified('password')) {
        return next()    // make sure add return, then the rest of the code will not run
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err)
        }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }

            // we're going to update the user's password.
            // So I'll say user.password is now the hash.
            // So we've now overwritten that plain text password and replaced it with the salted and patched password instead.
            user.password = hash
            next()
        })
    })
})


// Automate that password checking process
//! use the keyword function 
userSchema.methods.comparePassword = function (candidatePassword) {

    //! The only reason we are creating a promise here,
    //! is so we can make use of the async awaits whenever we try to compare a password.
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if (err) {
                return reject(err)
            }

            if (!isMatch) {
                return reject(false)
            }

            resolve(true)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = User