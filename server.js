import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import knex from 'knex'

import { saltMaker } from './utils/saltMaker.js'

const app = express()
const port = 4000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'leongaban',
    password: '',
    database: 'moon-portfolio',
  },
})

// db.select('*')
//   .from('users')
//   .then(data => {
//     console.log(data)
//   })

// ? ROOT //////////
// -----------------
app.get('/', (req, res) => {
  console.log({
    message: 'Moon Portfolio Server - RUNNING',
    // users: database.users,
  })
  res.json({
    message: 'Moon Portfolio Server - RUNNING',
  })
  // res.json(database)
})

// ? SIGIN //////////
// -----------------
app.post('/signin', async (req, res) => {
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

// ? REGISTER //////////
// --------------------
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  const saltRounds = saltMaker()

  // Store hash in your password DB.
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
          message: 'Unable to sign up.',
        })
      })
  })
})

// ? PROFILE //////////
// -------------------
app.get('/profile/:id', async (req, res) => {
  const { id } = req.params

  try {
    const user = await db.select('*').from('users').where({
      id,
    })

    if (user.length === 0) {
      throw new Error('User not found')
    }

    console.error('Found user:', user[0])

    res.status(200).send({
      status: 200,
      user: user[0],
      message: 'User found.',
    })
  } catch (error) {
    console.error('Error fetching user:', error)

    res.status(400).send({
      status: 400,
      message: 'Error getting user.',
    })
  }
})

// bcrypt.hash(myPlaintextPassword, saltRounds).then(function (hash) {
//   // Store hash in your password DB.
// })

// // Load hash from your password DB.
// bcrypt.compare(myPlaintextPassword, hash).then(function (result) {
//   // result == true
// })

app.listen(port, () => {
  console.log(`Moon Portfolio Server is running on port ${port}`)
})
