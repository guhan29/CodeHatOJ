const mongoose = require('mongoose')

const editorialSchema = new mongoose.Schema({
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: false
  },
  explaination: {
    type: String,
    required: false
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Editorial', editorialSchema)
