const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const dbCon = mongoose.connection
dbCon.on('error', console.error.bind(console, 'connection error: '))
dbCon.once('open', () => {
    console.log('Database connected')
})

const sample = arr => arr[Math.floor(Math.random() * arr.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const randomNum = Math.floor(1000 * Math.random())
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '684a948b691d36f93d26a955',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            geometry: {
                type: 'Point',
                coordinates: [28.99706, 41.070274]
            },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quo accusamus quam fuga consectetur, neque praesentium ipsam. Corrupti perferendis facilis temporibus esse! Maxime, laudantium. Consequatur ab dicta eius labore tenetur.',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dsmhaw698/image/upload/v1750168286/YelpCamp/kl8adgoabiubsobcahad.jpg',
                    filename: 'YelpCamp/kl8adgoabiubsobcahad',
                },
                {
                    url: 'https://res.cloudinary.com/dsmhaw698/image/upload/v1750168291/YelpCamp/hnztvttpn6mz6nsubvhq.jpg',
                    filename: 'YelpCamp/hnztvttpn6mz6nsubvhq',
                },
                {
                    url: 'https://res.cloudinary.com/dsmhaw698/image/upload/v1750168343/YelpCamp/i8rf9inbwfc3x32vrobw.jpg',
                    filename: 'YelpCamp/i8rf9inbwfc3x32vrobw',
                }
            ],

        })
        await camp.save()
    }
}

seedDB()
    .then(() => {
        dbCon.close()
    })