const express = require('express')
const router = express.Router()
const UserModel = require('../models/User.model')

router.get('/', (req, res) => {
  UserModel
    .find({})
    .then(users => res.json(users))
    .catch(error => next(error))
})

router.get('/:id', (req, res) => {
  UserModel.findById(req.params.id)
    .then(user => {
      if(user) {
        res.json(user)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

router.put('/:id', (req, res) => {
  var user = {
    ...req.body
  }
  if (user.hasOwnProperty('email')) {
    delete user.email
  }
  if (user.hasOwnProperty('username')) {
    delete user.username
  }
  if (user.hasOwnProperty('password')) {
    delete user.password
  }
  UserModel.findByIdAndUpdate(req.params.id, user, { new: true })
    .then(updatedUser => {
      res.json(updatedUser)
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

router.delete('/:id', (req, res) => {
  UserModel.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

router.post('/', (req, res) => {
  const user = new UserModel({
    ...req.body
  })

  user
    .save()
    .then(savedUser => {
      res.json(savedUser)
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

module.exports = router;
