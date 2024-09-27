const { fetchBookings } = require("../models/bookings.model");

exports.getBookings = (req, res, next) => {
  fetchBookings()
    .then((bookings) => {
      res.status(200).send({ bookings });
    })
    .catch((err) => {
      next(err);
    });
};
