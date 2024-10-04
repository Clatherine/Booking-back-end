
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

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