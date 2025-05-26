const { Schema, model } = require('mongoose')
const collectionName = 'productsIoT'

const schema = Schema({
  _id: { type: String, require: true },
  name: { type: String },
  img: { type: String},
  price: { type: String },
  quantity: { type: Number},
  isAvailable: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isRemove: { type: Boolean, default: false },
},{
    versionKey: false,
    strict: true,
    collection: collectionName,
    _id: false
})

module.exports = model(collectionName, schema)