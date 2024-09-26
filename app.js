const express = require("express");

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.all("*", ( res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err,  res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err,  res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input: expected a number" });
  } else next(err);
});

app.use((res) => {
  res.status(500).send({ msg: "internal server error" });
});


module.exports = app;
