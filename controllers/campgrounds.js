const Campground = require("../models/campground")
const { cloudinary } = require("../cloudinary")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')

const mbxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mbxToken })


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    const newCampground = new Campground(req.body.campground)

    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newCampground.author = req.user._id
    newCampground.geometry = geoData.body.features[0].geometry
    await newCampground.save()

    req.flash('success', 'Successfully created a new campground!')
    res.redirect(`/campgrounds/${newCampground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!campground) {
        req.flash('error', `No campground found with ID: ${id}`)
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', `No campground found with ID: ${id}`)
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    campground.images.push(...images)
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground')
    return res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Campground deleted!')
    res.redirect('/campgrounds')
}