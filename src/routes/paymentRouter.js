const express = require('express');
const paymentRouter = express.Router();

const paymentController = require('../controllers/paymentController');

paymentRouter.post('/create-payment', paymentController.createPayment);
paymentRouter.post('/generate-khqr', paymentController.generateKhqr);
paymentRouter.post('/check-transaction', paymentController.checkTransaction);

module.exports = paymentRouter;