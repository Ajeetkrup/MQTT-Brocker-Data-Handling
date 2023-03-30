const Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: 5432,
});

// const pool = new Pool({
//   user: 'me',
//   host: 'localhost',
//   database: 'mbdh',
//   password: 'password',
//   port: 5432,
// });

module.exports = pool;