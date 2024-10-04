// const { Pool } = require("pg");
const knex = require("knex")
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ 
  path: `${__dirname}/../.env.${ENV}` 
});


// if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
//   throw new Error("PGDATABASE or DATABASE_URL not set");
// }

// const config = {};

// if (ENV === "production") {
//   config.connectionString = process.env.DATABASE_URL;
//   config.max = 2;
// }

// module.exports = new Pool(config);

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