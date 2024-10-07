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
  pool: { min: 2, max: 10 },
};

module.exports = knex(dbConfig);