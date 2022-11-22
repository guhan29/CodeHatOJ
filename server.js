const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan((tokens, req, res) => {
  if(tokens.method(req, res) !== 'POST' && tokens.method(req, res) !== 'PUT') {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  } else {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.body(req, res)
    ].join(' ')
  }
}))

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hatcodeoj')
  .then(res => {
    console.log("Connected to mongodb.")
  })
  .catch(error => console.log(error));

app.use(express.static('public'))
app.use('/images', express.static('images'))
app.use('/fonts', express.static('fonts'))

app.get('/', (req, res) => {
  res.sendFile('/index.html')
})

// Passport
require('./passportConfig')

const userRoute = require('./routes/user.route')
const authRoute = require('./routes/auth.route')
const problemRoute = require('./routes/problem.route')
const categoryRoute = require('./routes/category.route')
const submissionsRoute = require('./routes/submission.route')
const editorialRoute = require('./routes/editorial.route')

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/problems', problemRoute)
app.use('/api/categories', categoryRoute)
app.use('/api/submissions', submissionsRoute)
app.use('/api/editorials', editorialRoute)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
