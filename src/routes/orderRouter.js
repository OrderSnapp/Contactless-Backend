const express = require('express');
const orderRouter = express.Router();

const orderController = require('../controllers/orderController');

orderRouter.post('', orderController.postOrder);

module.exports = orderRouter;

