const express = require("express");
const pool = require("../shared/pool");
const orders = express.Router();
const checkToken = require("../shared/checktoken");

//api to save orders
// orders.post("/add", checkToken, (req, res) => {
//   try {
//     let userName = req.body.userName;
//     let userEmail = req.body.userEmail;
//     let address = req.body.address;
//     let city = req.body.city;
//     let state = req.body.state;
//     let pin = req.body.pin;
//     let total = req.body.total;
//     let orderDetails = req.body.orderDetails;

//     pool.query(
//       `select id from users where email = '${userEmail}'`,
//       (error, user) => {
//         if (error) {
//           res.status(500).send({
//             error: error.code,
//             message: error.message,
//           });
//         } else {
//           if (user.length > 0) {
//             let userId = user[0].id;
//             const query = `insert into orders (userId,userName,address,city,state,pin,total)
//                   values
//                   ('${userId}','${userName}', '${address}','${city}' , '${state}' , '${pin}', '${total}' );
//                   select LAST_INSERT_ID()`;

//             pool.query(query, (error, result) => {
//               if (error) {
//                 res.status(401).send({
//                   error: error.code,
//                   message: error.message,
//                 });
//               } else {
//                 let orderId = result[0].insertId;
//                 orderDetails.forEach((item) => {
//                   const detailsQuery = `insert into orderdetails
//                               (orderId,productId,qty,price,amount) values
//                               (${orderId},${item.productId},${item.qty},${item.price},${item.amount})`;

//                   pool.query(detailsQuery, (detailsError, detailsResult) => {
//                     if (detailsError) {
//                       res.status(401).send({
//                         error: detailsError.code,
//                         message: detailsError.message,
//                       });
//                     }
//                   });
//                 });
//               }
//             });
//             res.status(201).send({
//               message: "success",
//             });
//           } else {
//             res.status(401).send({ message: "user does not exist. " });
//           }
//         }
//       }
//     );
//   } catch (error) {
//     res.status(400).send({
//       error: error.code,
//       message: error.message,
//     });
//   }
// });
orders.post("/add", checkToken, (req, res) => {
  try {
    let userName = req.body.userName;
    let userEmail = req.body.userEmail;
    let address = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let pin = req.body.pin;
    let total = req.body.total;
    let orderDetails = req.body.orderDetails;

    pool.query(
      `select id from users where email = '${userEmail}'`,
      (error, user) => {
        if (error) {
          res.status(500).send({
            error: error.code,
            message: error.message,
          });
        } else {
          if (user.length > 0) {
            let userId = user[0].id;
            const query = `insert into orders (userId,userName,address,city,state,pin,total)
                  values 
                  ('${userId}','${userName}', '${address}','${city}' , '${state}' , '${pin}', '${total}' );
                  select LAST_INSERT_ID()`;

            pool.query(query, (error, result) => {
              if (error) {
                res.status(401).send({
                  error: error.code,
                  message: error.message,
                });
              } else {
                let orderId = result[1][0]["LAST_INSERT_ID()"];
                orderDetails.forEach((item) => {
                  const detailsQuery = `insert into orderdetails
                              (orderId,productId,qty,price,amount) values
                              (${orderId},${item.productId},${item.qty},${item.price},${item.amount})`;

                  pool.query(detailsQuery, (detailsError, detailsResult) => {
                    if (detailsError) {
                      res.status(401).send({
                        error: detailsError.code,
                        message: detailsError.message,
                      });
                    }
                  });
                });

                // Modify the response to include orderId and amount
                res.status(201).send({
                  message: "success",
                  orderId: orderId,
                  amount: total,
                });
              }
            });
          } else {
            res.status(401).send({ message: "user does not exist. " });
          }
        }
      }
    );
  } catch (error) {
    res.status(400).send({
      error: error.code,
      message: error.message,
    });
  }
});

//api to get orders list
orders.get("/allorders", checkToken, (req, res) => {
  try {
    let userEmail = req.query.userEmail;
    pool.query(
      `select id from users where email = '${userEmail}'`,
      (error, user) => {
        if (error) {
          res.status(500).send({
            error: error.code,
            message: error.message,
          });
        } else {
          if (user.length > 0) {
            let userId = user[0].id;
            pool.query(
              `select orderId , DATE_FORMAT(orderDate, '%m/%d/%Y') as orderDate,userName,address,city,state,pin,total from orders where userId = ${userId}`,
              (error, orders) => {
                if (error) {
                  res.status(500).send({
                    error: error.code,
                    message: error.message,
                  });
                } else {
                  const allorders = [];
                  orders.forEach((order) => {
                    allorders.push({
                      orderId: order.orderId,
                      userName: order.userName,
                      address: order.address,
                      city: order.city,
                      state: order.state,
                      pin: order.pin,
                      total: order.total,
                      orderDetails: order.orderDetails,
                      orderDate: order.orderDate,
                    });
                  });
                  res.status(200).send(allorders);
                }
              }
            );
          }
        }
      }
    );
  } catch (error) {
    res.status(400).send({
      error: error.code,
      message: error.message,
    });
  }
});

//api to get all the orderproducts
orders.get("/orderproducts", checkToken, (req, res) => {
  try {
    let orderId = req.query.orderId;
    pool.query(
      `select orderdetails. *,products.product_name,products.product_img from orderDetails,products where orderDetails.productId = products.id and orderId = ${orderId}`,
      (error, orderProducts) => {
        if (error) {
          res.status(500).send({
            error: error.code,
            message: error.message,
          });
        } else {
          let orderDetails = [];
          orderProducts.forEach((orderProduct) => {
            orderDetails.push({
              productId: orderProduct.productId,
              productName: orderProduct.productName,
              productImage: orderProduct.product_img,
              qty: orderProduct.qty,
              price: orderProduct.price,
              amount: orderProduct.amount,
            });
          });
          res.status(200).send(orderDetails);
        }
      }
    );
  } catch (error) {
    res.status(400).send({
      error: error.code,
      message: error.message,
    });
  }
});

module.exports = orders;
