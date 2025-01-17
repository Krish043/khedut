const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    productname: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Price must be greater than 0'],
    },
    price: {
        type: Number,
        required: true,
        min: [0.01, 'Price must be greater than 0'],
    },
    description: {
        type: String,
        required: true,
    },
    uri: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
      }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;