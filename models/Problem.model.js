const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  handle: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  timeLimit: {
    type: Number,
    default: 2,
    max: 5
  },
  memoryLimit: {
    type: Number,
    default: 131072,
    max: 262144
  },
  inputExplaination: {
    type: String,
    required: true,
  },
  outputExplaination: {
    type: String,
    required: true,
  },
  bounds: {
    type: String,
    required: false
  },
  sampleTestCases: [
    {
      input: {
        type: String,
        required: false
      },
      output: {
        type: String,
        required: true
      },
      explaination: {
        type: String,
        required: false
      }
    }
  ],
  testCases: [
    {
      input: {
        type: String,
        required: false
      },
      output: {
        type: String,
        required: true
      }
    }
  ]
}, {
  timestamps: true
})

problemSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Problem', problemSchema)
