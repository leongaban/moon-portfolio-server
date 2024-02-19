import knex from 'knex'

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

export default db
