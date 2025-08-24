const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";
const path = require("path");
const dotenv = require("dotenv");

// Load the right .env file depending on NODE_ENV
dotenv.config({
  path: path.resolve(__dirname, `../.env.${ENV}`),
});

// If running in production, use DATABASE_URL
let config;

if (ENV === "production") {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not set in .env.production");
  }

  config = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // required for Neon
  };

  console.log("🌐 Using production DB URL:", process.env.DATABASE_URL);
} else {
  // local development/test config uses PGDATABASE
  if (!process.env.PGDATABASE) {
    throw new Error("PGDATABASE not set in .env." + ENV);
  }

  config = {};
  console.log("💻 Using local database:", process.env.PGDATABASE);
}

module.exports = new Pool(config);
