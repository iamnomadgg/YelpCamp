const express = require('express')
const router = express.Router({ mergeParams: true })

const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware.js')
const reviews = require('../controllers/reviews.js')

router.route('/')
    .post(isLoggedIn, validateReview, reviews.createReview)

router.route('/:reviewId')
    .delete(isLoggedIn, isReviewAuthor, reviews.deleteReview)

module.exports = router