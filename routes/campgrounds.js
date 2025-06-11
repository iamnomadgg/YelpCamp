const express = require('express')
const router = express.Router()
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas.js')

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

router.post('/', validateCampground, async (req, res) => {
    const newCampground = new Campground(req.body.campground)
    await newCampground.save()
    req.flash('success', 'Successfully created a new campground!')
    res.redirect(`/campgrounds/${newCampground._id}`)
})

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate('reviews')
    if (!campground) {
        req.flash('error', `No campground found with ID: ${id}`)
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
})

router.get('/:id/edit', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', `No campground found with ID: ${id}`)
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
})

router.put('/:id', validateCampground, async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${id}`)
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Campground deleted!')
    res.redirect('/campgrounds')
})

module.exports = router