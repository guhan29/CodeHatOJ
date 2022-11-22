const express = require('express')
const router = express.Router()
const passport = require('passport')
const CategoryModel = require('../models/Category.model')

router.get('/', (req, res) => {
  CategoryModel
    .find({})
    .then(categories => {
      res.json(categories)
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

router.get('/:id', (req, res) => {
  CategoryModel
    .findById(req.params.id)
    .then(category => {
      if(category) {
        res.json(category)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

router.put('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const category = {
    ...req.body
  }
  CategoryModel
    .findByIdAndUpdate(req.params.id, category, { new: true })
    .then(updatedCategory => {
      res.json(updatedCategory)
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  CategoryModel
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => res.statusCode(400).json({ error: error.message }))
})

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const category = new CategoryModel({ ...req.body })
  category
    .save()
    .then(savedCategory => {
      res.json(savedCategory)
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

module.exports = router;
