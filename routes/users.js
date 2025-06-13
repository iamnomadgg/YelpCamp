const express = require('express')
const router = express.Router()
const passport = require('passport')
const { moveLastPageInfoToLocals } = require('../middleware.js')
const users = require('../controllers/users.js')

router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.registerUser)

router.route('/login')
    .get(users.renderLoginForm)
    .post(moveLastPageInfoToLocals,
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        users.redirectAfterLogin)

router.route('/logout')
    .get(users.logoutUser)

module.exports = router