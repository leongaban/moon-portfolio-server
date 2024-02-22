import knex from 'knex'
import { config as dotenvConfig } from 'dotenv'
dotenvConfig()

const currentENV = process.env.ENVIRONMENT

let dbPayload = {
  host: '',
  port: '',
  user: '',
  password: '',
  database: '',
}

if (currentENV === 'localhost') {
  console.log('>> SERVER on LOCALHOST 🥑 <<<')
  const {
    LOCAL_HOST: host,
    LOCAL_DB_PORT: port,
    LOCAL_USER: user,
    LOCAL_DB_NAME: database,
    LOCAL_DB_PASS: password,
  } = process.env

  dbPayload = { ...dbPayload, host, port, user, password, database }
} else if (currentENV === 'production') {
  console.log('>>> SERVER on PRODUCTION 🌮 <<<')
  /* prettier-ignore */
  const {
    PROD_DB_NAME: database,
    PROD_DB_PASS: password,
    PROD_PORT: port,
    PROD_USER: user,
    INTERNAL_DB_URL: host
  } = process.env

  dbPayload = {
    ...dbPayload,
    host,
    port,
    user,
    password,
    database,
    ssl: { rejectUnauthorized: false }, // Specify SSL/TLS options for production environment
  }
}

const db = knex({
  client: 'pg',
  connection: { ...dbPayload },
})

export { currentENV, db }
