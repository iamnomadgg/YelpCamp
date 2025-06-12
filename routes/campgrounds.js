const express = require('express')
const router = express.Router()
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas.js')
const { isLoggedIn, isAuthor } = require('../middleware.js')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}



router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

router.post('/', isLoggedIn, validateCampground, async (req, res) => {
    const newCampground = new Campground(req.body.campground)
    newCampground.author = req.user._id
    await newCampground.save()
    req.flash('success', 'Successfully created a new campground!')
    res.redirect(`/campgrounds/${newCampground._id}`)
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate('reviews').populate('author')
    if (!campground) {
        req.flash('error', `No campground found with ID: ${id}`)
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
})

router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', `No campground found with ID: ${id}`)
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
})

router.put('/:id', isLoggedIn, isAuthor, validateCampground, async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully updated campground')
    return res.redirect(`/campgrounds/${id}`)
})

router.delete('/:id', isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Campground deleted!')
    res.redirect('/campgrounds')
})

module.exports = router