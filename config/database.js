const { Pool } = require("pg");
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const pool = new Pool({
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT || 5432,
});

console.log(pool.options.database);

module.exports = pool;
