const express = require('express')
const router = express.Router()
const passport = require('passport')
const UserModel = require('../models/User.model')
const ProblemModel = require('../models/Problem.model')

router.get('/', (req, res) => {
  ProblemModel
    .find({})
    .populate('category')
    .then(problems => {
      res.json(problems)
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

router.get('/:id', (req, res) => {
  ProblemModel
    .findById(req.params.id)
    .populate('category')
    .then(problem => {
      res.json(problem)
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

router.post('/', passport.authenticate('jwt', {session: false}),  (req, res) => {
  const problem = new ProblemModel({ ...req.body })
  problem
    .save()
    .then(savedUser => {
      res.json(savedUser)
    })
    .catch(error => res.status(400).json({ error: error.message }))
})



module.exports = router;
