const mongoose = require('mongoose');

const connect = () => {
    const uri = process.env.MONGO_URI;
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    mongoose.connection.on('error', error => console.log('error connect db', error))
    mongoose.connection.once('open', () => console.log('connect to saving db successfully'))
}

module.exports = { connect }