const express = require("express");
const productCategoires = require("./Routes/productCategories");
const products = require('./Routes/products');
const users = require('./Routes/users');
const bodyparser = require('body-parser');
const orders = require('./Routes/orders');

const app = express();
// const mysql = require("mysql2");
const PORT = 5001;

const cors = require('cors');
app.use(cors());
app.use(bodyparser.json());

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "Abhi@123",
//   database: "estore",
//   port: 3306,
//   multipleStatements: true,
// });

// app.get("/", (req, res) => {
// //   pool.getConnection((err, Connection) => {
//     // if (err) {
//     //   res.status(500).send(err);
//     // } else {
//       // fetching data using sql query
//       pool.query("select *from categories", (error, categoires) => {
//         if (error) {
//           res.status(500).send(error);
//         } else {
//           res.status(200).send(categoires);
//         }
    //   });
      //   res.status(200).send("connection is established");
    
//   });
    
    
// });



app.use('/productCategories', productCategoires);
app.use('/products', products);
app.use('/users', users);
app.use('/orders', orders);

const server = app.listen(PORT, () => {
  console.log("App is running on the port 5001 ");
});
