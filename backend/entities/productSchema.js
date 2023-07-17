const mongoose = require('mongoose')
const { Schema } = mongoose;

const productSchema = new Schema({
    productname: {
        type: String,
        unique: true,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0
    },
    sumPrice: {
        type: Number,
    }
})

const Product = mongoose.model("products", productSchema)

 module.exports = Product ;
