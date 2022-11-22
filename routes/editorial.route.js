const express = require('express')
const router = express.Router()
const passport = require('passport')
const EditorialModel = require('../models/Editorial.model')

router.get('/', (req, res) => {
  EditorialModel
    .find({})
    .then(editorials => {
      res.json(editorials)
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

router.get('/:id', (req, res) => {
  EditorialModel
    .findById(req.params.id)
    .then(editorial => {
      if(editorial) {
        res.json(editorial)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

router.get('/problem/:id', (req, res) => {
  EditorialModel
    .findOne({ problem: req.params.id})
    .then(editorial => {
      if(editorial) {
        res.json(editorial)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

// router.put('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
//   const category = {
//     ...req.body
//   }
//   CategoryModel
//     .findByIdAndUpdate(req.params.id, category, { new: true })
//     .then(updatedCategory => {
//       res.json(updatedCategory)
//     })
//     .catch(error => res.status(400).json({ error: error.message }))
// })

// router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
//   CategoryModel
//     .findByIdAndRemove(req.params.id)
//     .then(result => {
//       res.status(204).end()
//     })
//     .catch(error => res.statusCode(400).json({ error: error.message }))
// })

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const editorial = new EditorialModel({ ...req.body })
  editorial
    .save()
    .then(savedEditorial => {
      res.json(savedEditorial)
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

module.exports = router;
