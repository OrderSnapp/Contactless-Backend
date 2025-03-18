const OrderService = require('../services/OrderService');

const CreateOrder = async (req, res) => {
    return OrderService.createOrderService({req,res});
}

module.exports = {
    CreateOrder
};