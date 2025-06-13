const express = require('express')
const router = express.Router()
const passport = require('passport')
const { moveLastPageInfoToLocals } = require('../middleware.js')
const users = require('../controllers/users.js')

router.get('/register', users.renderRegisterForm)

router.post('/register', users.registerUser)

router.get('/login', users.renderLoginForm)

router.post('/login',
    moveLastPageInfoToLocals,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    users.redirectAfterLogin)

router.get('/logout', users.logoutUser)

module.exports = router