const OrderService = require('../services/orderService');

const CreateOrder = async (req, res) => {
    return OrderService.createOrderService({req,res});
}

module.exports = {
    CreateOrder
};