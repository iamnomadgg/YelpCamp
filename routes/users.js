const express = require('express')
const router = express.Router()
const ExpressError = require('../utils/ExpressError')
const User = require('../models/user')
const { userSchema } = require('../schemas.js')

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const newUser = await User.register(user, password)
    res.send(newUser)
})

module.exports = router