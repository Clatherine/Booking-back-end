const express = require("express");
const cors = require("cors");
require("dotenv").config(); 

const {
  getTables,
  getTablesByCapacity,
} = require("./controllers/tables.controller");

const {
  getBookings,
  deleteBooking,
  postBooking,
  patchBookingDetails,
  getBookingsByDateAndTable,
  getBookingsByDate,
  getBookingById,
  getBookingsByTimeSlot
} = require("./controllers/bookings.controller");

const {getTimes} = require("./controllers/times.controller")
const { getEndpoints } = require("./controllers/endpoints.controller");

const pool = require("./db/connection");

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  next();
});
app.get('/api', getEndpoints)

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()"); 
    res.status(200).send(result.rows);
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).send({ msg: "Database connection error", error });
  }
});

app.get("/api/tables/:capacity", getTablesByCapacity);

app.get('/api/tables', getTables)

app.get('/api/times', getTimes)

app.get("/api/bookings", (req, res) => {
  getBookings(req, res);
});

app.get('/api/bookings/timeslot/:start_time/:end_time', getBookingsByTimeSlot)

app.get("/api/bookings/date/:date/:table_id", getBookingsByDateAndTable); 

app.get("/api/bookings/date/:date", getBookingsByDate); 

app.delete("/api/bookings/:booking_id", deleteBooking)

app.post("/api/bookings", postBooking)

app.get("/api/bookings/:booking_id", getBookingById)

app.patch("/api/bookings/:booking_id", patchBookingDetails)


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
