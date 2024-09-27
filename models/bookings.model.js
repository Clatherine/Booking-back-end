const db = require("../db/connection");

exports.fetchBookings = () => {
  return db
    .query("SELECT booking_id, name, number_of_guests, date, start_time, end_time, notes FROM bookings")
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No tables found!" });
      }
      return rows;
    });
};
