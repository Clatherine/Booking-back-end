// const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL, // Use your DATABASE_URL
// });

// pool
//   .connect()
//   .then(() => {
//     console.log("Connected to the database successfully!");
//     return pool.end();
//   })
//   .catch((err) => {
//     console.error("Connection error:", err);
//   });

const knex = require("knex")(require("../knexfile").production); // Set up Knex

knex
  .raw("SELECT 1+1 AS result")
  .then(() => {
    console.log("Connection is successful");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  })
  .finally(() => {
    knex.destroy(); // Clean up the connection
  });