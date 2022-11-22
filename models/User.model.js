const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

userSchema.plugin(uniqueValidator)

userSchema.pre(
  'save',
  async function(next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10)

    this.password = hash
    next()
  }
)

userSchema.methods.isValidPassword = async function(password) {
  const user = this
  const compare = await bcrypt.compare(password, user.password)
  return compare
}

module.exports = mongoose.model('User', userSchema)
