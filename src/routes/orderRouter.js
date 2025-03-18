const express = require('express');
const orderRouter = express.Router();

const orderController = require('../controllers/orderController');

orderRouter.post('', orderController.CreateOrder);

module.exports = orderRouter;

