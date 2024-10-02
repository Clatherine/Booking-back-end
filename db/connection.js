// const { Pool } = require("pg");
// const dotenv = require("dotenv");
// // Configuration object for the PostgreSQL connection
// const config = { connectionString: process.env.DATABASE_URL };

// // Load environment variables
// const result = dotenv.config({
//   path:
//     process.env.NODE_ENV === "production"
//       ? ".env.production"
//       : ".env.development",
// }); // Load .env file regardless of NODE_ENV
// if (result.error) {
//   throw result.error;
// }

// // const ENV = process.env.NODE_ENV || "development";


// // Check if the environment variables are set correctly
// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL not set");
// }


// // Check if running in production
// if (process.env.NODE_ENV === "production") {
//  config.ssl = {
//    rejectUnauthorized: false, // Disable strict SSL verification for platforms like Railway
//  };
//  config.max = 2;
// }

// // Create a new pool with the configuration
// const pool = new Pool(config);

// // Log any unexpected errors on idle clients
// pool.on("error", (err) => {
//   console.error("Unexpected error on idle client", err);
//   process.exit(-1); // Exit the process on error
// });

// module.exports = pool;

const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";


require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});
console.log("PGDATABASE:", process.env.PGDATABASE);
console.log("DATABASE_URL:", process.env.DATABASE_URL);
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

module.exports = new Pool(config);