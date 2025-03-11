const OrderService = require('../services/OrderService');

const postOrder = async (req, res) => {
    return OrderService.createOrderService({req,res});
}

module.exports = {
    postOrder
};