const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')
const methodOverride = require('method-override')
const { reviewSchema } = require('./schemas.js')

const campgrounds = require('./routes/campgrounds')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const dbCon = mongoose.connection
dbCon.on('error', console.error.bind(console, 'connection error: '))
dbCon.once('open', () => {
    console.log('Database connected')
})

const app = express()
const port = 3000

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

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

app.use('/campgrounds', campgrounds)

app.get('/', (req, res) => {
    res.redirect('/campgrounds')
})

app.post('/campgrounds/:id/reviews', validateReview, async (req, res) => {
    const review = new Review(req.body.review)
    const campground = await Campground.findById(req.params.id)

    campground.reviews.push(review)
    await review.save()
    await campground.save()

    res.redirect(`/campgrounds/${req.params.id}`)
})

app.delete('/campgrounds/:id/reviews/:reviewId', async (req, res) => {
    const { id, reviewId } = req.params

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)

    res.redirect(`/campgrounds/${id}`)
})

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', { err })
})

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})