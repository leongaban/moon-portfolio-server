import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'

import { saltMaker } from './utils/saltMaker.js'

const app = express()
const port = 4000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

const database = {
  users: [
    {
      id: '123',
      name: 'Jenny',
      email: 'jenny@gmail.com',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'jenny@gmail.com',
      password: 'apples',
    },
  ],
}

app.get('/', (req, res) => {
  console.log({
    message: 'Moon Portfolio Server - RUNNING',
    // users: database.users,
  })
  res.json({
    message: 'Moon Portfolio Server - RUNNING',
    users: database.users,
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

  database.users.push({
    id: '125',
    email,
    password,
    hash,
    name,
    entries: 0,
    portfolio: [],
    joined: new Date(),
  })

  const newUser = database.users[database.users.length - 1]

  console.log('Registered new user:')
  console.log(newUser)
  console.log(database)

  res.status(200).send({
    status: 200,
    message: 'Register successful',
  })

  // res.status(200).json(newUser)
})

// ? PROFILE //////////
// -------------------
app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  const user = database.users.find(user => user.id === id)
  const not_found = 'not found'
  let found = false

  if (user) {
    found = true
    res.json(user)
  }

  if (!found) {
    res.status(400).json(not_found)
  }

  const log = found ? user : not_found
  console.log('Fetching user:', log)
})

app.put('/image', (req, res) => {
  const { id } = req.body
  const user = database.users.find(user => user.id === id)
  const not_found = 'not found'
  let found = false

  if (user) {
    found = true
    user.entries++
    return res.json(
      `User ${user.name} image entries updated to: ${user.entries}`
    )
  }

  if (!found) {
    res.status(400).json(not_found)
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
