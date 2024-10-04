const format = require("pg-format");
const devData = require("../data/development-data/index.js"); 

// This is the Knex seed function structure
const seed = function (knex, data) {
   const { tablesData, bookingsData, timesData} = data; 
  // Clear existing data and create tables
  return knex
    .raw(`DROP TABLE IF EXISTS bookings;`)
    .then(() => {
      return knex.raw(`DROP TABLE IF EXISTS tables;`);
    })
    .then(()=>{
      return knex.raw('DROP TABLE IF EXISTS times')
    })
    .then(()=>{
        return knex.schema.createTable("times", (table)=>{
          
          table.time("opening_time").notNullable()
           table.time("closing_time").notNullable();
        })
    }).then(()=>{
      return knex.schema.createTable("tables", (table) => {
        table.increments("table_id").primary();
        table.integer("capacity").notNullable();
        table.string("notes")
     
      })

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
       
      })
      })
    .then(() => {

      const insertTablesQueryStr = format(
        "INSERT INTO tables (capacity, notes) VALUES %L;",
        tablesData.map(({ capacity, notes }) => [capacity, notes])
      );
      return knex.raw(insertTablesQueryStr);
    })
    .then(() => {
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
    .then(()=>{
      const insertTimesQueryStr = format(
        "INSERT INTO times ( opening_time, closing_time) VALUES %L;", 
        timesData.map(
          ({ opening_time, closing_time})=>[
            opening_time,closing_time
          ]
        )
      );
      return knex.raw(insertTimesQueryStr)
    })
    .catch((error) => {
      console.error("Error seeding data:", error);
    });
};

module.exports = seed