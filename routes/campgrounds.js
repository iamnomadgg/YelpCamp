const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js')
const campgrounds = require('../controllers/campgrounds.js')

router.get('/', campgrounds.index)

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post('/', isLoggedIn, validateCampground, campgrounds.createCampground)

router.get('/:id', campgrounds.showCampground)

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm)

router.put('/:id', isLoggedIn, isAuthor, validateCampground, campgrounds.updateCampground)

router.delete('/:id', isLoggedIn, isAuthor, campgrounds.deleteCampground)

module.exports = router