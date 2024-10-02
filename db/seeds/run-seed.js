
const seedData = require("./seed.js");
const db = require("../connection.js");

exports.seed = function (knex) {
  console.log('entering run-seed')
  // Call the seed function with your dev data
  return seedData.seed(knex)
    .then(() => {
      // Optionally, you can end the database connection here.
      return db.end();
    })
    .catch((err) => {
      console.error("Error seeding data:", err);
      // Ensure you end the database connection even if an error occurs
      return db.end();
    });
};