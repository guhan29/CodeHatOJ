const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
})

categorySchema.plugin(uniqueValidator)

module.exports = mongoose.model('Category', categorySchema)
