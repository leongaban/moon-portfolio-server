import knex from 'knex'
import { config as dotenvConfig } from 'dotenv'
dotenvConfig()

const currentENV = process.env.ENVIRONMENT

let host
let port
let user
let password
let database

if (currentENV === 'localhost') {
  console.log('WE ARE IN LOCALHOST')
  const {
    LOCAL_HOST,
    LOCAL_DB_PORT,
    LOCAL_USER,
    LOCAL_DB_NAME,
    LOCAL_DB_PASS,
  } = process.env

  host = LOCAL_HOST
  port = LOCAL_DB_PORT
  user = LOCAL_USER
  database = LOCAL_DB_NAME
  password = LOCAL_DB_PASS
} else if (currentENV === 'production') {
  console.log('WE ARE IN PRODUCTION')
  const { PROD_DB_NAME, PROD_DB_PASS, PROD_PORT, PROD_USER, INTERNAL_DB_URL } =
    process.env

  host = INTERNAL_DB_URL
  port = PROD_PORT
  user = PROD_USER
  database = PROD_DB_NAME
  password = PROD_DB_PASS
}

const db = knex({
  client: 'pg',
  connection: {
    host,
    port,
    user,
    password,
    database,
  },
})

export { currentENV, db }
