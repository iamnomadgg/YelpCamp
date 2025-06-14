const Joi = require('joi')
const user = require('./models/user')

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})

module.exports.userSchema = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().required(),
        password: Joi.string().required()
    }).required()
})