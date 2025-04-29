const OrderService = require('../services/orderService');

const CreateOrder = async (req, res) => {
    return OrderService.createOrderService({req,res});
}

const CreateCustomerOrder = async (req, res) => {
    return OrderService.createCustomerOrderService({req,res});
}

const GetAllOrderbyStatus = async (req, res) => {
    return OrderService.getAllOrdersByStatusService({req,res});
}

const GetProgressOrderStatus = async (req, res) => {
    return OrderService.getProgressOrderStatusService({req,res});
}

const UpdateOrderStatus = async (req, res) => {
    return OrderService.updateOrderStatusService({req,res});
}

const GetAllKitchenStatus = async (req, res) => {
    return OrderService.getAllKitchenStatusService({req,res});
}

const getNewPendingOrderNotification = async (req, res) => {
    return OrderService.getNewPendingOrderNotificationService({req,res});
}

module.exports = {
    CreateOrder,
    CreateCustomerOrder,
    GetAllOrderbyStatus,
    GetProgressOrderStatus,
    UpdateOrderStatus,
    GetAllKitchenStatus,
    getNewPendingOrderNotification
};