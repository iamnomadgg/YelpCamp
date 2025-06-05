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
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Et quo accusamus quam fuga consectetur, neque praesentium ipsam. Corrupti perferendis facilis temporibus esse! Maxime, laudantium. Consequatur ab dicta eius labore tenetur.',
            price
        })
        await camp.save()
    }
}

seedDB()
    .then(() => {
        dbCon.close()
    })