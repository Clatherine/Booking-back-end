const knex = require("knex")
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ 
  path: `${__dirname}/../.env.${ENV}` 
});

const dbConfig = {
  client: "pg",
  connection: process.env.DATABASE_URL || {
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
  },
  pool: { min: 0, max: 5 },
};
console.log("Connecting to database with URL:", process.env.DATABASE_URL);

module.exports = knex(dbConfig);