const express = require("express");
const cors = require("cors");
const {getTables} = require("./controllers/tables.controller")

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/tables', getTables)

// Catch all invalid paths
app.all("*", (req, res) => {
  // Include 'req' here
  res.status(404).send({ msg: "Route not found" });
});

// Custom error handler for known errors
app.use((err, req, res, next) => {
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
  console.error(err.stack); 
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
