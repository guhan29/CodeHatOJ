const express = require('express')
const router = express.Router()
const passport = require('passport')
const SubmissionModel = require('../models/Submission.model')
const axios = require('axios')
const mongoose = require('mongoose')

router.get('/', (req, res) => {
  SubmissionModel
    .find({})
    .then(submissions => {
      res.json(submissions)
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

router.get('/problem/:pid/user/:userId', (req, res) => {
  SubmissionModel
    .find({ problem: mongoose.Types.ObjectId(req.params.pid), user: mongoose.Types.ObjectId(req.params.userId) })
    .sort({ createdAt: -1 })
    .then(submission => {
      if(submission) {
        res.json(submission)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => res.status(400).json({ error: error.message }))
})

router.get('/:id', (req, res) => {
  SubmissionModel
    .findById(req.params.id)
    .populate('problem')
    .populate('user')
    .then(submission => {
      if(submission) {
        res.json(submission)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => res.status(400).json({ error: error.message }))
})


router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const userId = req.user._id;
  const subData = {
    problemId: req.body.problemId,
    script: req.body.code,
    language: req.body.language,
    testcases: req.body.testcases
  }

  // let submission = new SubmissionModel({
  //   problem: data.problemId,
  //   code: data.script,
  //   language: data.language,
  //   user: userId
  // })

  let finalVerdict = true

  try {
    var testResults1 = []
    for (let i = 0; i < subData.testcases.length; i++) {
      let tc = subData.testcases[i]
      var postData = {
        clientId: process.env.JDOODLE_clientId,
        clientSecret: process.env.JDOODLE_clientSecret,
        script: subData.script,
        language: subData.language,
        versionIndex: "4",
        stdin: tc.input
      }

      const result = await axios.post('https://api.jdoodle.com/v1/execute', postData)
      // console.log(result);
      // console.log(result.data);
      // res.json(result.data);
      // testResults.push(result.data)
      let data = result.data
      console.log(data);
      let verdict = 'Error'
      let time = "Error";
      if (data.memory != null && data.cpuTime != null) {
        if (data.output.trim() == tc.output.trim()) {
          verdict = 'Accepted'
        } else {
          verdict = 'Wrong Answer'
        }
        time = data.cpuTime
      } else if (data.output.includes('Timeout')) {
        verdict = 'Time Limit Exceeded'
      } else {
        verdict = 'Error'
      }
      finalVerdict = finalVerdict && (verdict == 'Accepted')
      testResults1.push({ verdict, time })
    }
    console.log(testResults1)
    let submission = new SubmissionModel({
      problem: subData.problemId,
      code: subData.script,
      language: subData.language,
      testResults: testResults1,
      user: userId,
      result: finalVerdict
    })
    const savedSub = await submission.save()
    res.status(201).json(savedSub)
  } catch (err) {
    console.log(err)
  }
  
  // category
  //   .save()
  //   .then(savedCategory => {
  //     res.json(savedCategory)
  //   })
  //   .catch(error => res.status(400).json({ error: error.message }))
})

module.exports = router;
