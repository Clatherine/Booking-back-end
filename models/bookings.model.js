const db = require("../db/connection");
const format = require("pg-format"); 

exports.fetchBookings = () => {
  return db("bookings")
    .select(
      "booking_id",
      "name",
      "number_of_guests",
      db.raw("TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time"),
      db.raw("TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time"),
      "status",
      "notes",
      "table_id"
    )
    .then((rows) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No bookings found!" });
      }
      return rows;
    });
};

exports.fetchBookingById = (booking_id) => {
  return db("bookings")
    .select(
      "booking_id",
      "name",
      "number_of_guests",
      db.raw("TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time"),
      db.raw("TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time"),
      "status",
      "notes",
      "table_id"
    )
    .where({ booking_id })
    .then((rows) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Booking not found" });
      }
      return rows[0];
    });
};

exports.removeBooking = (booking_id) => {
  return db("bookings")
    .where({ booking_id })
    .del()
    .returning("*")
    .then((rows) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "That booking does not exist!",
        });
      }
      return rows[0]; // Return the deleted booking if needed
    });
};

exports.addBooking = (booking) => {
  const valuesArr = [
    {
      name: booking.name,
      number_of_guests: booking.number_of_guests,
      start_time: booking.start_time,
      end_time: booking.end_time,
      status: booking.status,
      notes: booking.notes,
      table_id: booking.table_id || null,
    },
  ];

  return db("bookings")
    .insert(valuesArr)
    .returning([
      "booking_id",
      "name",
      "number_of_guests",
      db.raw("TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time"),
      db.raw("TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time"),
      "status",
      "notes",
      "table_id",
    ])
    .then((rows) => {
      return rows[0];
    });
};

exports.updateBookingStatus = (booking_id, newStatus, table_id) => {
  if (newStatus !== "submitted" && !table_id) {
    return Promise.reject({
      status: 400,
      msg: 'A table_id must be provided when the status is not "submitted".',
    });
  }

  return db("bookings")
    .where({ booking_id })
    .update({ status: newStatus, table_id: table_id || null })
    .returning([
      "booking_id",
      "name",
      "number_of_guests",
      db.raw("TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time"),
      db.raw("TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time"),
      "status",
      "notes",
      "table_id",
    ])
    .then((rows) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Booking not found" });
      }
      return rows[0];
    });
};

exports.updateBookingDetails = (booking_id, updates) => {
  const keys = Object.keys(updates);
  if (keys.length === 0) {
    return Promise.reject({
      status: 400,
      msg: "No fields provided for update.",
    });
  }

  return db("bookings")
    .where({ booking_id })
    .update(updates)
    .returning([
      "booking_id",
      "name",
      "number_of_guests",
      db.raw("TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time"),
      db.raw("TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time"),
      "status",
      "notes",
      "table_id",
    ])
    .then((rows) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Booking not found" });
      }
      return rows[0];
    });
};

exports.fetchBookingsByDate = (date) => {
  return db("bookings")
    .select(
      "booking_id",
      "name",
      "number_of_guests",
      db.raw("TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time"),
      db.raw("TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time"),
      "status",
      "notes",
      "table_id"
    )
    .whereRaw("DATE(start_time) = ?", [date])
    .then((rows) => {
      return rows;
    });
};

exports.fetchBookingsByDateAndTable = (date, table_id) => {
  return db("bookings")
    .select(
      "booking_id",
      "name",
      "number_of_guests",
      db.raw("TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time"),
      db.raw("TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time"),
      "status",
      "notes",
      "table_id"
    )
    .whereRaw("DATE(start_time) = ? AND table_id = ?", [date, table_id])
    .then((rows) => {
      return rows;
    });
};

exports.fetchBookingsByTimeSlot = (start_time, end_time) => {
  if (end_time <= start_time) {
    return Promise.reject({
      status: 400,
      msg: "End time must be after start time!",
    });
  } else {
    return db("bookings")
      .select(
        "booking_id",
        "name",
        "number_of_guests",
        db.raw("TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time"),
        db.raw("TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time"),
        "status",
        "notes",
        "table_id"
      )
      .whereRaw(
        "start_time = ? OR end_time = ? OR (start_time < ? AND start_time > ?) OR (end_time > ? AND end_time < ?)",
        [start_time, end_time, end_time, start_time, start_time, end_time]
      )
      .then((rows) => {
        return rows;
      });
  }
};
