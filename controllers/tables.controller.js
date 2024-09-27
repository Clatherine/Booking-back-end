const { fetchTables } = require("../models/tables.model");

exports.getTables = (req, res, next) => {
  fetchTables()
    .then((tables) => {
      res.status(200).send({ tables });
    })
    .catch((err) => {
      next(err);
    });
};
