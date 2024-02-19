import express from 'express'
import validatePassword from '../middlewares/validatePassword.js'
import { registerUser, signinUser } from '../controllers/authControllers.js'

const router = express.Router()

router.route('/register').post(validatePassword, registerUser)

router.route('/signin').post(signinUser)

// // TODO move to userRoutes, if we still need this
// // ? GET PROFILE
// router.get('/profile/:id', async (req, res) => {
//   const { id } = req.params

//   try {
//     const user = await db.select('*').from('users').where({
//       id,
//     })

//     if (user.length === 0) {
//       throw new Error('User not found')
//     }

//     console.error('Found user:', user[0])

//     res.status(200).send({
//       status: 200,
//       user: user[0],
//       message: 'User found.',
//     })
//   } catch (error) {
//     console.error('Error fetching user:', error)

//     res.status(400).send({
//       status: 400,
//       message: 'Error getting user.',
//     })
//   }
// })

export { router as authRoutes }
