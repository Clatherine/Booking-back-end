const path = require("path");
const dotenv = require("dotenv");
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.join(__dirname, envFile) });
const { DATABASE_URL } = process.env;

console.log('databse url:', DATABASE_URL)
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "",
      database: "booking",
    },
    pool: { min: 0, max: 5 },
    seeds: {
      directory: "./db/seeds",
    },
  },

  production: {
    client: "pg",
    connection: DATABASE_URL,
    pool: { min: 0, max: 5 },
    seeds: {
      directory: "./db/seeds",
    },
  },
};
