const { Schema, model } = require('mongoose')
const collectionName = 'userIoT'

const schema = Schema({
  _id: { type: String, require: true },
  id: {type: String},
  firstName: { type: String },
  lastName: { type: String },
  cardCode: { type: String},
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