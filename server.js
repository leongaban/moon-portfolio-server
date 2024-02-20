import express from 'express'
import cors from 'cors'
import { config as dotenvConfig } from 'dotenv'
import { authRoutes } from './routes/authRoutes.js'
import db from './constants/db.js'

dotenvConfig()
const app = express()
const port = process.env.PORT
const currentENV = process.env.ENVIRONMENT

let corsOptions

if (currentENV === 'localhost') {
  corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  }
} else {
  corsOptions = {
    origin: 'https://moonportfolio.com',
    optionsSuccessStatus: 200,
  }
}

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors(corsOptions))

// ? Routes
app.use('/', authRoutes)

// ? ROOT
// -------------------------
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

// ? Test route
// -----------------------------
app.get('/test', (req, res) => {
  db.select('*')
    .from('users')
    .then(data => {
      console.log(data)
      res.json({
        message: data,
      })
    })
})

app.listen(port, () => {
  console.log(`Moon Portfolio Server is running on port ${port}`)
})
