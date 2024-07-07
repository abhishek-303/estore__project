const express = require('express');
const products = express.Router();

const pool = require('../shared/pool');

//route for fetching all the data
products.get('/', (req, res) => {
    
    var mainCategoryId = req.query.maincategoryid;
    var subCategoryId = req.query.subcategoryid;
    var keyword = req.query.keyword;
    let query = 'select * from products';

    if (subCategoryId) {
        query += ' where category_id = ' + subCategoryId; 
    }
    if (mainCategoryId) {
// This query is a SQL query that selects all columns (*) from the products table where the category_id of the product matches the id of a category in the categories table, and the parent_category_id of that category is equal to the value of mainCategoryId 
        query = `select products.* from products, categories where products.category_id =
         categories.id and categories.parent_category_id = ${mainCategoryId}`;
    }
      if (keyword) {
        query += ` AND  keywords LIKE '%${keyword}%'`;
      }


   

    pool.query(query, (error, products) => {
        if (error) {
            res.status(500).send(error);
        }
        else {
            res.status(200).send(products);
        }
    });
});

// Route for getting a single product 
products.get('/(:id)', (req, res) => {
  
    let id = req.params.id;
    pool.query('select * from products where id  = ' + id, (error, products) => {
        if (error) {
          res.status(500).send(error);
        } else {
          res.status(200).send(products);
        }
    })

})
module.exports = products;

