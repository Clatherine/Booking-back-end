const express = require("express");
const cors = require("cors");
const {getTables} = require("./controllers/tables.controller")
const {getBookings, deleteBooking, postBooking,  patchBookingDetails, getBookingsByTableAndDate, getBookingsByDate} = require("./controllers/bookings.controller")

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/tables', getTables)



app.get("/api/bookings/date/:date/:table_id", getBookingsByTableAndDate);

app.get("/api/bookings/date/:date", getBookingsByDate);


app.delete("/api/bookings/:booking_id", deleteBooking)

app.get("/api/bookings", getBookings);

app.post("/api/bookings", postBooking)

app.patch("/api/bookings/:booking_id", patchBookingDetails)





// app.get("/api/bookings/:date/:start_time/:end_time", getBookingsByDateAndTime)


// Catch all invalid paths
app.all("*", (req, res) => {
  // Include 'req' here
  res.status(404).send({ msg: "Route not found" });
});

// Custom error handler for known errors
app.use((err, req, res, next) => {
  console.error(err)
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err); // Pass the error to the next error handler
  }
});

// Custom error handler for PostgreSQL error (e.g., invalid input)
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input: expected a number" });
  } else {
    next(err);
  }
});

// General error handler for uncaught errors
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
