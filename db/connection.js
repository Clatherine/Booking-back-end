const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`, // Load environment-specific configuration
});

// Check if the environment variables are set correctly
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

// Configuration object for the PostgreSQL connection
const config = {};

// Check if running in production
if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.ssl = {
    rejectUnauthorized: false, // This disables strict SSL verification, useful for platforms like Heroku
  };
  config.max = 2; // Limit the number of clients the pool can handle in production
}

// Create a new pool with the configuration
const pool = new Pool(config);

// Log any unexpected errors on idle clients
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1); // Exit the process on error
});

module.exports = pool;
