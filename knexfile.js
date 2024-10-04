
const path = require("path");
const dotenv = require("dotenv");
// console.log(process.env, 'process.env')
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.join(__dirname, envFile) });
const { DATABASE_URL } = process.env;

console.log(DATABASE_URL, 'database_url from knexfile')

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "",
      database: "booking",
    },
    pool: { min: 0, max: 10 },
    seeds: {
      directory: "./db/seeds",
    },
  },

  production: {
    client: "pg",
    connection: DATABASE_URL,
    pool: { min: 2, max: 10 },
    seeds: {
      directory: "./db/seeds",
    },
  },
};
