const mongoose = require('mongoose')
const { Schema } = mongoose;

const cartSchema = new Schema({
    user: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'products',
        quantity: {
            type: Number,
            default: 0
        },
        sumPrice: {
            type: Number,
            default: 0
        }
    }],
    total: {
        type: Number,
        default: 0
    }

})

 const Cart = mongoose.model('carts', cartSchema);

 module.exports = Cart ;