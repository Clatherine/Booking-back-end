const db = require("../db/connection");
const fs = require("fs/promises");
const format = require("pg-format");

exports.fetchBookings = () => {
  return db
    .query("SELECT booking_id, name, number_of_guests, date, start_time, end_time, status, notes, table_id FROM bookings")
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No tables found!" });
      }
      return rows;
    });
};

exports.removeBooking = (booking_id) => {
     return db
       .query("DELETE FROM bookings WHERE booking_id = $1 RETURNING *", [
         booking_id,
       ])
       .then(({ rows }) => {
         if (rows.length === 0) {
           return Promise.reject({
             status: 404,
             msg: "That booking does not exist!",
           });
         }
       });
}

exports.addBooking = (booking) =>{
const valuesArr = [[booking.name, booking.number_of_guests, booking.date, booking.start_time, booking.end_time, booking.status, booking.notes, null]]
const formattedQuery = format("INSERT INTO bookings(name, number_of_guests, date, start_time, end_time, status, notes, table_id) VALUES %L RETURNING *", valuesArr)
    return db.query(formattedQuery).then(({ rows }) => {
      return rows[0];
    });
}

exports.updateBookingStatus = (booking_id, newStatus, table_id) => {
  if (newStatus !== "submitted" && !table_id) {
    return Promise.reject({
      status: 400,
      msg: 'A table_id must be provided when the status is not "submitted".',
    });
  }

  const query = `
    UPDATE bookings
    SET status = $1, table_id = $2
    WHERE booking_id = $3
    RETURNING *;
  `;

  const values = [newStatus, table_id || null, booking_id]; // Only set table_id if provided

  return db.query(query, values).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Booking not found" });
    }
    return rows[0];
  });
};