const db = require("../db/connection");

exports.fetchTables = () => {
  return db.query("SELECT table_id, capacity, notes FROM tables").then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No tables found!" });
    }
    return rows;
  });
};

exports.fetchTablesByCapacity = (capacity) => {
  return db
    .query(`SELECT * FROM tables WHERE capacity >= $1`, [capacity])
    .then(({ rows }) => {
        return rows;
    });
};