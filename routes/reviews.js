const express = require('express')
const router = express.Router({ mergeParams: true })
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const Review = require('../models/review')
const { reviewSchema } = require('../schemas.js')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}

router.post('/', validateReview, async (req, res) => {
    const review = new Review(req.body.review)
    const campground = await Campground.findById(req.params.id)

    campground.reviews.push(review)
    await review.save()
    await campground.save()

    res.redirect(`/campgrounds/${req.params.id}`)
})

router.delete('/:reviewId', async (req, res) => {
    const { id, reviewId } = req.params

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)

    res.redirect(`/campgrounds/${id}`)
})

module.exports = router