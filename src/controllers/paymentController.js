const PaymentService = require('../services/paymentService');

const createPayment = async (req, res) => {
    return PaymentService.createPayment({req, res});
}

const generateKhqr = async (req, res) => {
    return PaymentService.generateKhqr({req, res});
}

const checkTransaction = async (req, res) => {
    return PaymentService.checkTransaction({req, res});
}

module.exports = {
    createPayment,
    generateKhqr,
    checkTransaction
}