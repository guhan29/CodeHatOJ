const jwt = require('jsonwebtoken')

const genToken = (user) => {
  return jwt.sign(
    {
      iss: "Guhan",
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    process.env.SECRET_KEY || "top-secret"
  )
}

module.exports = { genToken }
