const express = require('express')
const router = express.Router({ mergeParams: true })
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const Review = require('../models/review')
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware.js')

router.post('/', isLoggedIn, validateReview, async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id

    campground.reviews.push(review)
    await review.save()
    await campground.save()

    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${req.params.id}`)
})

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, async (req, res) => {
    const { id, reviewId } = req.params

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)

    req.flash('success', 'Review deleted!')
    res.redirect(`/campgrounds/${id}`)
})

module.exports = router