
// const {seed} = require("./seed.js");
// const data = require("../data/development-data/index");
// const knex = require("../connection.js");

// exports.runSeed = function () {
//   console.log('entering run-seed')
//   // console.log(knex, 'knex')
//   // return seedData`.seed(knex)`
//   return seed(knex, data)
//     .then(() => {
//       console.log('seeding completed successfully')
//       // Optionally, you can end the database connection here.
//       return knex.destroy();
//     })
//     .catch((err) => {
//       console.error("Error seeding data:", err);
//       // Ensure you end the database connection even if an error occurs
//       return knex.destroy();
//     });
// };