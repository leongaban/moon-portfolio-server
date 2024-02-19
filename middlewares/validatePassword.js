const validatePassword = (req, res, next) => {
  if (!req.body.password) {
    return next(
      res.status(409).send({
        status: 409,
        message: 'Each field needs to be filled',
      })
    )
  }

  const password = req.body.password
  const letters = password.match(/[A-z]/g)
  const numbers = password.match(/[0-9]/g)
  // const specialChars = password.match(/[^A-z0-9\s]/g)

  if (
    password.length >= 2 &&
    letters !== null &&
    numbers !== null
    // specialChars !== null
  ) {
    next()
  } else {
    next(
      res.status(403).send({
        status: 403,
        message: 'Password needs to have at least 1 number and 1 letter',
      })
    )
  }
}

export default validatePassword
