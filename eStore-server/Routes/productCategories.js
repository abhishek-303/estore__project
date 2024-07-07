const express = require("express");
const productCategoires = express.Router();


const pool = require('../shared/pool');
// const mysql = require("mysql2");


// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "Abhi@123",
//   database: "estore",
//   port: 3306,
//   multipleStatements: true,
// });



productCategoires.get("/", (req, res) => {
  //   pool.getConnection((err, Connection) => {
  // if (err) {
  //   res.status(500).send(err);
  // } else {
  // fetching data using sql query
  pool.query("select *from categories", (error, categoires) => {
    if (error) {
      res.status(500).send(error);
    } else {
       res.status(200).send(categoires);
      // console.log(categoires);
      
    }
  });
  //   res.status(200).send("connection is established");

  //   });
});


module.exports = productCategoires;