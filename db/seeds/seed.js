const format = require("pg-format");
const db = require("../connection");


const seed = ({ bookingsData, tablesData }) => {
  return db
    .query(`DROP TABLE IF EXISTS bookings;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS tables;`);
    })
    .then(() => {
      const bookingsTablePromise = db.query(`
      CREATE TABLE bookings (
        booking_id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        number_of_guests INT NOT NULL,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status VARCHAR DEFAULT 'submitted',
        notes VARCHAR
      );`);

      const tablesTablePromise = db.query(`
      CREATE TABLE tables (
      table_id SERIAL PRIMARY KEY,
       capacity INT NOT NULL,
       notes VARCHAR
       );`);

      return Promise.all([bookingsTablePromise, tablesTablePromise]);
    })
    .then(() => {
      const insertBookingsQueryStr = format(
        "INSERT INTO bookings (name, number_of_guests, date, start_time, end_time, status, notes) VALUES %L;",
        bookingsData.map(({ name, number_of_guests, date, start_time, end_time, status, notes }) => [
          name,
          number_of_guests,
          date,
          start_time,
          end_time,
          status,
          notes,
        ])
      );
      const bookingsPromise = db.query(insertBookingsQueryStr);

      const insertTablesQueryStr = format(
        "INSERT INTO tables ( capacity, notes) VALUES %L;",
        tablesData.map(({ capacity, notes }) => [capacity, notes])
      );
      const tablesPromise = db.query(insertTablesQueryStr);

      return Promise.all([bookingsPromise, tablesPromise]);
    })
};

module.exports = seed;
