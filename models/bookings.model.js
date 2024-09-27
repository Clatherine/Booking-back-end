const db = require("../db/connection");

exports.fetchBookings = () => {
  return db
    .query("SELECT booking_id, name, number_of_guests, date, start_time, end_time, status, notes FROM bookings")
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
  console.log(booking, 'booking')
const valuesArr = [[booking.name, booking.number_of_guests, booking.date, booking.start_time, booking.end_time, booking.status, booking.notes]]
const formattedQuery = format("INSERT INTO bookings(name, number_of_guests, date, start_time, end_time, status, notes) VALUES %L RETURNING *", valuesArr)
    return db.query(formattedQuery).then(({ rows }) => {
      console.log(rows, 'rows')
      return rows[0];
    });
}