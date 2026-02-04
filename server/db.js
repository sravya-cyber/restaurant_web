const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',           // Your pgAdmin username
  host: 'localhost',
  database: 'restaurant',
  password: 'rass',   // Your pgAdmin password
  port: 5432,
});

module.exports = pool;