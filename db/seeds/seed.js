// const format = require("pg-format");
// const db = require("../connection");


// const seed = ({ bookingsData, tablesData }) => {
//   return db
//     .query(`DROP TABLE IF EXISTS bookings;`)
//     .then(() => {
//       return db.query(`DROP TABLE IF EXISTS tables;`);
//     })
//     .then(() => {
//        return db.query(`
//       CREATE TABLE tables (
//       table_id SERIAL PRIMARY KEY,
//        capacity INT NOT NULL,
//        notes VARCHAR
//        );`);})
//        .then(()=>{  return db.query(`
//       CREATE TABLE bookings (
//         booking_id SERIAL PRIMARY KEY,
//         name VARCHAR NOT NULL,
//         number_of_guests INT NOT NULL,
//         start_time TIMESTAMP NOT NULL,
//         end_time TIMESTAMP NOT NULL,
//         status VARCHAR DEFAULT 'submitted',
//         notes VARCHAR,
//         table_id INT REFERENCES tables(table_id) ON DELETE SET NULL DEFAULT NULL
//       );`);})
//     .then(() => {  const insertTablesQueryStr = format(
//       "INSERT INTO tables ( capacity, notes) VALUES %L;",
//       tablesData.map(({ capacity, notes }) => [capacity, notes])
//     );
//     return db.query(insertTablesQueryStr);}).then(()=>{    const insertBookingsQueryStr = format(
//         "INSERT INTO bookings (name, number_of_guests, start_time, end_time, status, notes, table_id) VALUES %L;",
//         bookingsData.map(({ name, number_of_guests, start_time, end_time, status, notes, table_id }) => [
//           name,
//           number_of_guests,
//           // date,
//           start_time,
//           end_time,
//           status,
//           notes,
//           table_id
//         ])
//       );
//       return db.query(insertBookingsQueryStr);
//     })
// };

// module.exports = seed;

const format = require("pg-format");
// const db = require("../connection");
// const knex = require("knex")(require("../knexfile").production);
const devData = require("../data/development-data/index.js"); // Adjust this path as needed

// This is the Knex seed function structure
exports.seed = function (knex) {
  console.log('entering seed')
  // Clear existing data and create tables
  return knex
    .raw(`DROP TABLE IF EXISTS bookings;`)
    .then(() => {
      console.log('booking table has been dropped')
      return knex.raw(`DROP TABLE IF EXISTS tables;`);
    })
    .then(() => {
      return knex.schema.createTable("tables", (table) => {
        table.increments("table_id").primary();
        table.integer("capacity").notNullable();
        table.string("notes");
      });
    })
    .then(() => {
      return knex.schema.createTable("bookings", (table) => {
        table.increments("booking_id").primary();
        table.string("name").notNullable();
        table.integer("number_of_guests").notNullable();
        table.timestamp("start_time").notNullable();
        table.timestamp("end_time").notNullable();
        table.string("status").defaultTo("submitted");
        table.string("notes");
        table
          .integer("table_id")
          .references("table_id")
          .inTable("tables")
          .onDelete("SET NULL");
      });
    })
    .then(() => {
      const { tablesData } = devData; // Extract data from your data source

      const insertTablesQueryStr = format(
        "INSERT INTO tables (capacity, notes) VALUES %L;",
        tablesData.map(({ capacity, notes }) => [capacity, notes])
      );
      return knex.raw(insertTablesQueryStr);
    })
    .then(() => {
      const { bookingsData } = devData; // Use the same data source
      const insertBookingsQueryStr = format(
        "INSERT INTO bookings (name, number_of_guests, start_time, end_time, status, notes, table_id) VALUES %L;",
        bookingsData.map(
          ({
            name,
            number_of_guests,
            start_time,
            end_time,
            status,
            notes,
            table_id,
          }) => [
            name,
            number_of_guests,
            start_time,
            end_time,
            status,
            notes,
            table_id,
          ]
        )
      );
      return knex.raw(insertBookingsQueryStr);
    })
    .catch((error) => {
      console.error("Error seeding data:", error);
    });
};