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

db.select('*')
  .from('users')
  .then(data => {
    console.log(data)
  })

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
    // Load hash from your password DB.
    // ? currently just testing to user1
    const result = await bcrypt.compare(
      password,
      '$2b$05$/KtRBUW6RkuCWRTBRFR9WeYyarQbz3wu7Ku5kODyhyAUUCH6pRWr.'
    )

    console.log('bcrypt compare result:', result)

    if (result === true) {
      // Authentication successful
      res.status(200).send({
        status: 200,
        user: database.users[0],
        message: 'Signin successful',
      })
    } else {
      // Authentication failed
      res.status(401).send({
        status: 401,
        message: 'Invalid credentials',
      })
    }
  } catch (error) {
    // Handle any errors
    console.error(error)
    res.status(500).send('Internal server error')
  }
})

// ? REGISTER //////////
// --------------------
app.post('/register', async (req, res) => {
  const { email, password, name } = req.body
  const saltRounds = saltMaker()

  // Store hash in your password DB.
  const hash = await bcrypt.hash(password, saltRounds).then(hashed => hashed)

  db.insert({
    name,
    email,
    joined: new Date(),
  })
    .into('users')
    .returning('*')
    .then(user => {
      console.log('User inserted successfully', user[0])
      res.status(200).send({
        status: 200,
        message: 'Sign up successful',
      })
    })
    .catch(error => {
      console.error('Error inserting user:', error)
      res.status(400).send({
        status: 400,
        message: 'Unable to sign up.',
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
