const express = require('express');
const router = express.Router();
const UserModel = require('../models/User.model')
const passport = require('passport')
const { genToken } = require('../util')

router.get('/', passport.authenticate('jwt', {session: false}), (req,res,next)=>{
  res.json(req.user)
})

router.post('/login', async function (req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Invalid Email or password' })
    }
    const isValid = await user.isValidPassword(password)
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid Email or password' })
    }
    const token = genToken(user)
    res.json({user, token})
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
  
  
});

router.get('/secret', passport.authenticate('jwt', {session: false}), (req,res,next)=>{
  // res.json("Secret Data")
  res.json(req.user)
})


module.exports = router;
