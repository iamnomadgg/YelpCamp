const express = require('express')
const router = express.Router()
const passport = require('passport')
const ExpressError = require('../utils/ExpressError')
const User = require('../models/user')
const { userSchema } = require('../schemas.js')
const { moveLastPageInfoToLocals } = require('../middleware.js')

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

router.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to YelpCamp!')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', moveLastPageInfoToLocals, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = res.locals.lastPageInfo || '/campgrounds'
    delete res.locals.lastPageInfo
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err)
        req.flash('success', 'Goodbye!')
        res.redirect('/campgrounds')
    })
})

module.exports = router