const db = require("../db/connection");

exports.fetchTimes = () => {
  return db("times")
    .select("*")
    .then((rows) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No times found!" });
      }
      return rows;
    });
};