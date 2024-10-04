// const db = require("../db/connection");
// const format = require("pg-format");

// exports.fetchBookings = () => {
//   return db
//     .query(
//       "SELECT booking_id, name, number_of_guests, TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time,TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time, status, notes, table_id FROM bookings"
//     )
//     .then(({ rows }) => {
//       if (rows.length === 0) {
//         return Promise.reject({ status: 404, msg: "No tables found!" });
//       }
//       return rows;
//     });
// };

// exports.fetchBookingById = (booking_id) => {
//   return db
//     .query(
//       "SELECT booking_id, name, number_of_guests, TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time,TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time, status, notes, table_id FROM bookings WHERE booking_id = $1",
//       [booking_id]
//     )
//     .then(({ rows }) => {
//       if (rows.length === 0) {
//         return Promise.reject({ status: 404, msg: "Booking not found" });
//       }
//       return rows[0];
//     });
// };

// exports.removeBooking = (booking_id) => {
//   return db
//     .query("DELETE FROM bookings WHERE booking_id = $1 RETURNING *", [
//       booking_id,
//     ])
//     .then(({ rows }) => {
//       if (rows.length === 0) {
//         return Promise.reject({
//           status: 404,
//           msg: "That booking does not exist!",
//         });
//       }
//     });
// };

// exports.addBooking = (booking) => {
//   console.log('entering addBooking')
//   const valuesArr = [
//     [
//       booking.name,
//       booking.number_of_guests,
//       booking.start_time,
//       booking.end_time,
//       booking.status,
//       booking.notes,
//       booking.table_id || null,
//     ],
//   ];
//   const formattedQuery = format(
//     "INSERT INTO bookings(name, number_of_guests, start_time, end_time, status, notes, table_id) VALUES %L RETURNING booking_id, name, number_of_guests, TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time,TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time, status, notes, table_id",
//     valuesArr
//   );
//   return db.query(formattedQuery).then(({ rows }) => {
//     return rows[0];
//   });
// };

// exports.updateBookingStatus = (booking_id, newStatus, table_id) => {
//   if (newStatus !== "submitted" && !table_id) {
//     return Promise.reject({
//       status: 400,
//       msg: 'A table_id must be provided when the status is not "submitted".',
//     });
//   }

//   const query = `
//     UPDATE bookings
//     SET status = $1, table_id = $2
//     WHERE booking_id = $3
//     RETURNING booking_id, name, number_of_guests, TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time,TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time, status, notes, table_id;
//   `;

//   const values = [newStatus, table_id || null, booking_id]; // Only set table_id if provided

//   return db.query(query, values).then(({ rows }) => {
//     if (rows.length === 0) {
//       return Promise.reject({ status: 404, msg: "Booking not found" });
//     }
//     return rows[0];
//   });
// };

// // In your bookings.model.js
// exports.updateBookingDetails = (booking_id, updates) => {
//   const keys = Object.keys(updates);
//   if (keys.length === 0) {
//     return Promise.reject({
//       status: 400,
//       msg: "No fields provided for update.",
//     });
//   }

//   const setClause = keys
//     .map((key, index) => `${key} = $${index + 1}`)
//     .join(", ");
//   const values = keys.map((key) => updates[key]);

//   // Add booking_id to the end of the values array
//   values.push(booking_id);

//   const query = `
//     UPDATE bookings
//     SET ${setClause}
//     WHERE booking_id = $${values.length}
//     RETURNING booking_id, name, number_of_guests, TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time,TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time, status, notes, table_id;
//   `;

//   return db.query(query, values).then(({ rows }) => {
//     if (rows.length === 0) {
//       return Promise.reject({ status: 404, msg: "Booking not found" });
//     }
//     return rows[0];
//   });
// };

// exports.fetchBookingsByDate = (date) => {

//   return db
//     .query(
//       `SELECT booking_id, name, number_of_guests, TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time,TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time, status, notes, table_id FROM bookings WHERE DATE(start_time) = $1`,
//       [date]
//     )
//     .then(({ rows }) => {
     
//         return rows;
      
//     });
// };

// exports.fetchBookingsByDateAndTable = (date, table_id) => {
//   return db
//     .query(
//       `SELECT booking_id, name, number_of_guests, TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time,TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time, status, notes, table_id FROM bookings WHERE DATE(start_time) = $1 AND table_id = $2`,
//       [date, table_id]
//     )
//     .then(({ rows }) => {
//         return rows;
//     });
// };

// exports.fetchBookingById = (booking_id) => {
//   return db
//     .query(
//       `SELECT booking_id, name, number_of_guests, TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time,TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time, status, notes, table_id FROM bookings WHERE booking_id = $1`,
//       [booking_id]
//     )
//     .then(({ rows }) => {
//       if (rows.length === 0) {
//         return Promise.reject({
//           status: 404,
//           msg: "No booking of that id!",
//         });
//       } else {
//         return rows[0];
//       }
//     });
// };

// exports.fetchBookingsByTimeSlot = (start_time, end_time) =>{

//   if (end_time<= start_time){
//       return Promise.reject({
//         status: 400,
//         msg: "End time must be after start time!",
//       });
//   }
//   else{
//   return db
//     .query(
//       `SELECT 
//       booking_id,
//   name,
//   number_of_guests,
//   TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI:SS') AS start_time,
//   TO_CHAR(end_time, 'YYYY-MM-DD HH24:MI:SS') AS end_time,
//   status,
//   notes, table_id
//     FROM bookings WHERE 
//         start_time = $1 
//         OR (start_time < $2 AND start_time > $1)
//         OR (end_time > $1 AND end_time < $2)`,
//       [start_time, end_time]
//     )
//     .then(({ rows }) => {
//         return rows;
//     });
//   }
// }

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
