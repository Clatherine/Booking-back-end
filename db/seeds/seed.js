const format = require("pg-format");
const db = require("../connection");


const seed = ({ bookingsData, tablesData }) => {
  return db
    .query(`DROP TABLE IF EXISTS bookings;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS tables;`);
    })
    .then(() => {
       return db.query(`
      CREATE TABLE tables (
      table_id SERIAL PRIMARY KEY,
       capacity INT NOT NULL,
       notes VARCHAR
       );`);})
       .then(()=>{  return db.query(`
      CREATE TABLE bookings (
        booking_id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        number_of_guests INT NOT NULL,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status VARCHAR DEFAULT 'submitted',
        notes VARCHAR,
        table_id INT REFERENCES tables(table_id) ON DELETE SET NULL DEFAULT NULL
      );`);})
    .then(() => {  const insertTablesQueryStr = format(
      "INSERT INTO tables ( capacity, notes) VALUES %L;",
      tablesData.map(({ capacity, notes }) => [capacity, notes])
    );
    return db.query(insertTablesQueryStr);}).then(()=>{    const insertBookingsQueryStr = format(
        "INSERT INTO bookings (name, number_of_guests, date, start_time, end_time, status, notes, table_id) VALUES %L;",
        bookingsData.map(({ name, number_of_guests, date, start_time, end_time, status, notes, table_id }) => [
          name,
          number_of_guests,
          date,
          start_time,
          end_time,
          status,
          notes,
          table_id
        ])
      );
      return db.query(insertBookingsQueryStr);
    })
};

module.exports = seed;
