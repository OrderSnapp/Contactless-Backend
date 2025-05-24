const express = require('express');
const orderRouter = express.Router();

const orderController = require('../controllers/orderController');
const { authRoleMiddleware } = require('../middlewares/authMiddleware');

orderRouter.post('', orderController.CreateOrder);
orderRouter.post('/customer-orders', orderController.CreateCustomerOrder);
orderRouter.get('/order-status/:status', orderController.GetAllOrderbyStatus);
orderRouter.get('/progress-status', orderController.GetProgressOrderStatus);
orderRouter.post('/update-status/:orderNumber', authRoleMiddleware(['Kitchen','Staff']), orderController.UpdateOrderStatus);
orderRouter.get('/kitchen-status', authRoleMiddleware(['Kitchen']), orderController.GetAllKitchenStatus);
orderRouter.get('/new-pending-order-notification', orderController.getNewPendingOrderNotification);
orderRouter.get('/order-history', orderController.getOrderHistoryController);
orderRouter.get('/order-items/:id', orderController.getOrderDetailsController);

module.exports = orderRouter;

