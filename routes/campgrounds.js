const express = require('express')
const router = express.Router()
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js')
const campgrounds = require('../controllers/campgrounds.js')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, validateCampground, upload.array('image'), campgrounds.createCampground)

router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(campgrounds.showCampground)
    .put(isLoggedIn, isAuthor, validateCampground, campgrounds.updateCampground)
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground)

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, campgrounds.renderEditForm)

module.exports = router