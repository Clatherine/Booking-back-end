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
        number_of_guests NUMBER NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        notes VARCHAR
      );`);

      const tablesTablePromise = db.query(`
      CREATE TABLE table (
      table_id SERIAL PRIMARY KEY,
       capacity NUMBER NOT NULL,
       notes VARCHAR

       );`);

      return Promise.all([bookingsTablePromise, tablesTablePromise]);
    })
    .then(() => {
      const insertBookingsQueryStr = format(
        "INSERT INTO bookings (name, number_of_guests, date, time, notes) VALUES %L;",
        bookingsData.map(({ name, number_of_guests, date, time, notes }) => [
          name,
          number_of_guests,
          date,
          time,
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
