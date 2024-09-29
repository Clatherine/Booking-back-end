const {
  fetchBookings,
  fetchBookingById,
  removeBooking,
  addBooking,
  updateBookingDetails,
  fetchBookingsByDateAndTable,
  fetchBookingsByDate,
  fetchBookingsByTimeSlot,
} = require("../models/bookings.model");
const db = require("../db/connection");
const {
  fetchTablesByCapacity,
} = require("../models/tables.model");

exports.getBookings = (req, res, next) => {
  fetchBookings()
    .then((bookings) => {
      res.status(200).send({ bookings });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteBooking = (req, res, next) => {
  const { booking_id } = req.params;
  removeBooking(booking_id)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
};

exports.postBooking = (req, res, next) => {
  const { body } = req;
  const name = body.name;
  const number_of_guests = body.number_of_guests;
  const start_time = body.start_time;
  const status = body.status;
  const table_id = body.table_id;

  if (!name || !number_of_guests || !start_time) {
    res.status(400).send({
      msg: "Incomplete POST request: one or more required fields missing data",
    });
  } else {
    if (!body.end_time) {
      // Parse start_time into a Date object
      const startTimeDate = new Date(body.start_time);

      // Add 2 hours (2 hours * 60 minutes * 60 seconds * 1000 milliseconds)
      const twoHoursLater = new Date(
        startTimeDate.getTime() + 2 * 60 * 60 * 1000
      );

      // Format the date back to 'YYYY-MM-DD HH:mm:ss'
      body.end_time = twoHoursLater
        .toISOString()
        .replace("T", " ")
        .substring(0, 19);
    }
    if (status === "submitted" || !table_id) {
      fetchTablesByCapacity(number_of_guests).then((tables) => {
        if (!tables.length) {
          body.status = "rejected";
          addBooking(body).then((addedBooking) => {
            res.status(201).send({ addedBooking });
          });
        } else {
          fetchBookingsByTimeSlot(start_time, body.end_time).then(
            (bookings) => {
              const bookedTableIds = new Set(
                bookings.map((booking) => booking.table_id)
              );
              const tablesWithCapacityAndAvailability = tables.filter(
                (table) => {
                  return !bookedTableIds.has(table.table_id); // Filter out tables that are booked
                }
              );
              let smallestAvailableTable = tablesWithCapacityAndAvailability[0];
              for (
                let i = 0;
                i < tablesWithCapacityAndAvailability.length;
                i++
              ) {
                if (
                  tablesWithCapacityAndAvailability[i].capacity <
                  smallestAvailableTable.capacity
                ) {
                  smallestAvailableTable = tablesWithCapacityAndAvailability[i];
                }
              }
              if (smallestAvailableTable) {
                body.table_id = smallestAvailableTable.table_id;
                body.status = "confirmed";
              } else {
                body.status = "rejected";
              }
              addBooking(body).then((addedBooking) => {
                res.status(201).send({ addedBooking });
              });
            }
          );
        }
      });
    } else {
      addBooking(body).then((addedBooking) => {
        res.status(201).send({ addedBooking });
      });
    }
  }
};

// add in what to do if status is submitted:
// check if there's a table number -->, if so, do the below (addBooking(body))
//else:
// fetch tables with appropriate capacity
// --> if none, then change status to rejected, no table number
// if there are some, fetch bookings by date & timeslot
// filter tables with capacity to those that are not included in the returned bookings by date and timeslot --> identify the first one
// take that table number and add it to the body. then do addBooking(body)

// add in what to do if no end-time added: add an end time that is 2 hours from start-time

// if (body.status !== "submitted" && !body.table_id) {
//   return res
//     .status(400)
//     .send({
//       msg: 'A table_id must be provided when the status is not "submitted".',
//     });
// }

exports.patchBookingDetails = (req, res, next) => {
  const { booking_id } = req.params;
  const { status, number_of_guests, start_time, end_time, table_id } = req.body;

  // Fetch the current booking details
  fetchBookingById(booking_id)
    .then((booking) => {
      // Check if the provided table_id is valid if being set
      if (table_id) {
        return db
          .query("SELECT * FROM tables WHERE table_id = $1", [table_id])
          .then(({ rows }) => {
            if (rows.length === 0) {
              return Promise.reject({
                status: 400,
                msg: "Invalid table_id: does not exist.",
              });
            }
            return booking; // Return the original booking if the table_id is valid
          });
      }
      return booking; // No table_id provided, just return the booking
    })
    .then((booking) => {
      if (
        status &&
        status !== "submitted" &&
        booking.status === "submitted" &&
        !table_id
      ) {
        return Promise.reject({
          status: 400,
          msg: 'A table_id must be provided when the status is not "submitted".',
        });
      }

      // Construct the updates object
      const updates = {};
      if (status) updates.status = status;
      if (number_of_guests) updates.number_of_guests = number_of_guests;
      if (start_time) updates.start_time = start_time;
      if (end_time) updates.end_time = end_time;
      if (table_id) updates.table_id = table_id; // Only add table_id if provided

      // Call a function to update the booking
      return updateBookingDetails(booking_id, updates);
    })
    .then((updatedBooking) => {
      res.status(200).send({ updatedBooking });
    })
    .catch(next);
};
exports.getBookingsByDate = (req, res, next) => {
  const { date } = req.params;

  fetchBookingsByDate(date)
    .then((bookings) => {
      res.status(200).send({ bookings });
    })
    .catch(next);
};

exports.getBookingsByDateAndTable = (req, res, next) => {
  const { date, table_id } = req.params;
  fetchBookingsByDateAndTable(date, table_id)
    .then((bookings) => {
      res.status(200).send({ bookings });
    })
    .catch(next);
};

exports.getBookingById = (req, res, next) => {
  const { booking_id } = req.params;
  fetchBookingById(booking_id)
    .then((booking) => {
      res.status(200).send({ booking });
    })
    .catch(next);
};

exports.getBookingsByTimeSlot = (req, res, next) => {
  console.log("entering");
  const { start_time, end_time } = req.params;
  fetchBookingsByTimeSlot(start_time, end_time)
    .then((bookings) => {
      res.status(200).send({ bookings });
    })
    .catch(next);
};
