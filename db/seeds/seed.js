const format = require("pg-format");

const seed = function (knex, data) {
  const { tablesData, bookingsData} = data;

  return knex.transaction((trx)=>{
return trx.schema
    .dropTableIfExists("bookings")
    .then(() => trx.schema.dropTableIfExists("tables"))
    .then(() => trx.schema.dropTableIfExists("times"))
    .then(() => {
      return trx.schema.createTable("tables", (table) => {
        table.increments("table_id").primary();
        table.integer("capacity").notNullable();
        table.string("notes");
      });
    })
    .then(() => {
      return trx.schema.createTable("bookings", (table) => {
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
      const insertTablesQueryStr = format(
        "INSERT INTO tables (capacity, notes) VALUES %L;",
        tablesData.map(({ capacity, notes }) => [capacity, notes])
      );
      return trx.raw(insertTablesQueryStr);
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
      return trx.raw(insertBookingsQueryStr);
    })
    
    .catch((error) => {
      console.error("Error seeding data:", error);
    });
  })
};

module.exports = seed;
