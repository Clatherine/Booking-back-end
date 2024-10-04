const db = require("../db/connection");

exports.fetchTables = () => {
  return db("tables")
    .select("*")
    .then((rows) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No tables found!" });
      }
      return rows;
    });
};

exports.fetchTablesByCapacity = (capacity) => {
 return db("tables")
   .select("*")
   .where("capacity", ">=", capacity)
   .then((rows) => {
     return rows;
   });
};

exports.fetchTableById = (table_id) => {
  return db("tables")
  .select("*")
  .where("table_id", "=", table_id)
  .then((rows)=>{
    if(rows.length ===0){
        return Promise.reject({ status: 404, msg: "No table of that id!" });
    }
    return rows
  })
}