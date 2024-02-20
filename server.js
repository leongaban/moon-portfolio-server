import express from 'express'
import cors from 'cors'
import { config as dotenvConfig } from 'dotenv'
import { authRoutes } from './routes/authRoutes.js'
import { currentENV, db } from './constants/db.js'

dotenvConfig()
const app = express()
const port = process.env.PORT

let corsOptions

if (currentENV === 'localhost') {
  corsOptions = {
    origin: 'http://localhost:3000',
  }
} else {
  corsOptions = {
    origin: 'https://moonportfolio.com',
  }
}

console.log('corsOptions', corsOptions)

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
  console.log('TEST route hit!')

  db.select('*')
    .from('users')
    .then(data => {
      console.log(data)
      res.json({
        data: data,
        message: 'TEST route',
      })
    })
})

app.listen(port, () => {
  console.log(`Moon Portfolio Server is running on port ${port}`)
})
