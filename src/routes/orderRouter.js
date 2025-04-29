const express = require('express');
const orderRouter = express.Router();

const orderController = require('../controllers/orderController');

orderRouter.post('', orderController.CreateOrder);
orderRouter.post('/customer-orders', orderController.CreateCustomerOrder);
orderRouter.get('/order-status/:status', orderController.GetAllOrderbyStatus);
orderRouter.get('/progress-status', orderController.GetProgressOrderStatus);
orderRouter.post('/update-status/:orderNumber', orderController.UpdateOrderStatus);
orderRouter.get('/kitchen-status', orderController.GetAllKitchenStatus);
orderRouter.get('/new-pending-order-notification', orderController.getNewPendingOrderNotification);

module.exports = orderRouter;

