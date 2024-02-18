const database = {
  users: [
    {
      id: '123', // serial PRIMARY key
      name: 'Jenny', // VARCHAR(100)
      email: 'jenny@gmail.com', // text unique not null
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: '987', // serial PRIMARY key
      hash: '', // varchar(100)
      email: 'jenny@gmail.com', // text unique not null
    },
  ],
  portfolios: [
    {
      id: 'abc', // serial PRIMARY key
      email: 'jenny@gmail.com', // text unique not null
      coins: [
        // JSON
        {
          id: 'BTCUSD',
          name: 'Bitcoin',
          symbol: 'BTC',
          total: 0.21694,
        },
      ],
    },
  ],
}
