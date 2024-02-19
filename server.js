import express from 'express'
import cors from 'cors'
import { config as dotenvConfig } from 'dotenv'
import { authRoutes } from './routes/authRoutes.js'

dotenvConfig()
const app = express()
const port = process.env.PORT

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// ? Routes
app.use('/', authRoutes)

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

app.listen(port, () => {
  console.log(`Moon Portfolio Server is running on port ${port}`)
})
