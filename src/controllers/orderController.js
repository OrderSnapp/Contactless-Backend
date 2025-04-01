const OrderService = require('../services/orderService');

const CreateOrder = async (req, res) => {
    return OrderService.createOrderService({req,res});
}

const CreateCustomerOrder = async (req, res) => {
    return OrderService.createCustomerOrderService({req,res});
}

module.exports = {
    CreateOrder,
    CreateCustomerOrder
};