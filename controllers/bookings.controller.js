const { fetchBookings, fetchBookingById, removeBooking, addBooking, updateBookingDetails, fetchBookingsByTableAndDate, fetchBookingsByDate } = require("../models/bookings.model");
const db = require("../db/connection");

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
  const {booking_id} = req.params
  removeBooking(booking_id)
.then(()=>{
  res.status(204).end()
})
.catch(next)
}

exports.postBooking = (req, res, next) =>{
  const {body} = req
const name = body.name
const number_of_guests = body.number_of_guests
const date = body.date
const start_time = body.start_time
if (!name || !number_of_guests || !date || !start_time){
  res.status(400).send({msg: "Incomplete POST request: one or more required fields missing data"})
}

  if (body.status !== "submitted" && !body.table_id) {
    return res
      .status(400)
      .send({
        msg: 'A table_id must be provided when the status is not "submitted".',
      });
  } else {
    addBooking(body)
      .then((addedBooking) => {
        res.status(201).send({ addedBooking });
      })
      .catch(next);
  }}

exports.patchBookingDetails = (req, res, next) => {
  const { booking_id } = req.params;
  const { status, number_of_guests, date, start_time, table_id } = req.body;
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
      // Check if status is being updated
      if (status && booking.status === "submitted" && !table_id) {
        return Promise.reject({
          status: 400,
          msg: 'A table_id must be provided when the status is not "submitted".',
        });
      }

      // Construct the updates object
      const updates = {};
      if (status) updates.status = status;
      if (number_of_guests) updates.number_of_guests = number_of_guests;
      if (date) updates.date = date;
      if (start_time) updates.start_time = start_time;
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
  console.log(date, "date");
  fetchBookingsByDate(date)
    .then((bookings) => {
      res.status(200).send({ bookings });
    })
    .catch(next);
};

exports.getBookingsByTableAndDate = (req,res,next) => {
    const { date, table_id } = req.params;
    fetchBookingsByTableAndDate(date, table_id)
      .then((bookings) => {
        res.status(200).send({ bookings });
      })
      .catch(next);
}

