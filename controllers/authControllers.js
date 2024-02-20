import bcrypt from 'bcrypt'
import asyncMiddleware from '../middlewares/asyncErrorHandler.js'
import { saltMaker } from '../utils/saltMaker.js'
import { db } from '../constants/db.js'

// ? REGISTER USER
// -------------------------------------------------------------
const registerUser = asyncMiddleware(async (req, res, next) => {
  const { name, email, password } = req.body
  const saltRounds = saltMaker()
  const hash = await bcrypt.hash(password, saltRounds)

  db.transaction(trx => {
    trx
      .insert({
        hash,
        email,
      })
      .into('login')
      .returning('email')
      .then(user => {
        return trx
          .insert({
            name,
            email: user[0].email,
            joined: new Date(),
          })
          .into('users')
          .returning('*')
          .then(user => {
            console.log('User sign up successful', user[0])
            res.status(200).send({
              status: 200,
              message: 'Sign up successful',
            })
          })
          .then(trx.commit)
          .catch(trx.rollback)
      })
      .catch(error => {
        console.error('Error inserting user:', error)
        res.status(400).send({
          status: 400,
          message: 'Unable to sign up',
        })
      })
  })
})

// ? SIGIN USER
// -----------------------------------------------------------
const signinUser = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body

  try {
    const data = await db
      .select('email', 'hash')
      .from('login')
      .where('email', '=', email)

    if (data.length === 0) {
      return res.status(400).json('Invalid email or password')
    }

    const hashMatch = await bcrypt.compare(password, data[0].hash)

    if (hashMatch) {
      return db
        .select('*')
        .from('users')
        .where('email', '=', email)
        .then(user => {
          console.log('Succesful login for', user[0].email)
          res.status(200).send({
            status: 200,
            user: user[0],
            message: 'Sign in successful',
          })
        })
        .catch(err => {
          throw new Error('Unable to get user', err)
        })
    } else {
      res.status(400).send('Wrong credentials')
    }
  } catch (error) {
    console.log('Something bad happened:', error)
    res.status(400).send('Wrong credentials')
  }
})

export { registerUser, signinUser }
