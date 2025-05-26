const { Schema, model } = require('mongoose');
const collectionName = 'salesIoT';

const schema = new Schema({
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    products: [{
        productId: String,
        quantity: Number,
        price: Number
    }],
    total: Number,
    date: { type: Date, default: Date.now },
    isCompleted: { type: Boolean, default: true }
}, {
    collection: collectionName,
    _id: false,
    versionKey: false
});

module.exports = model(collectionName, schema);