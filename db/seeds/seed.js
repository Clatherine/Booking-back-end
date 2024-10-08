const format = require("pg-format");
const devData = require("../data/development-data/index");

exports.seed = function (knex, data) {
   const { tablesData, bookingsData } = data || devData;

   if (!tablesData || !bookingsData) {
     throw new Error("Missing tablesData or bookingsData");
   }

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
      return trx.schema.createTable("bookings", (booking) => {
        booking.increments("booking_id").primary();
        booking.string("name").notNullable();
        booking.integer("number_of_guests").notNullable();
        booking.timestamp("start_time").notNullable();
        booking.timestamp("end_time").notNullable();
        booking.string("status").defaultTo("submitted");
        booking.string("notes");
        booking
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


