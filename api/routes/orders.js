const express = require('express');

const router = express.Router();

// const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
// const Order = require('../models/order');
// const Product = require('../models/product'); // no more require of these import

const OrdersController = require('../controllers/orders');
// handling the incoming Get requests to /orders
router.get("/", checkAuth, OrdersController.orders_get_all);

router.post("/", checkAuth, OrdersController.orders_create_order);   

    // following code gives individual order

router.get("/:orderId", checkAuth, OrdersController.orders_get_order);

router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order);

module.exports = router; 