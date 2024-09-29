const { fetchTables, fetchTablesByCapacity } = require("../models/tables.model");

exports.getTables = (req, res, next) => {
  fetchTables()
    .then((tables) => {
      res.status(200).send({ tables });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getTablesByCapacity = (req, res, next) => {
  const { capacity } = req.params;
  fetchTablesByCapacity(capacity)
    .then((tables) => {
      res.status(200).send({ tables });
    })
    .catch(next);
};