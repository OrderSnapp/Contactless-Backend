const apiResponse = require('../utils/apiResponse');
const Order = require('../models/orderModel');
const OrderStatusLogs = require('../models/orderStatusLogsModel');
const OrderItem = require('../models/orderDetailModel');

const createOrderService = async ({ req, res }) => {
  return apiResponse(res, 201, 'Review created successfully');
};

const createCustomerOrderService = async ({ req, res }) => {
  const data = req.body;
  const items = data.items;

 const order = {
    tableId: data.tableNumber,
    orderNumber: data.orderNumber,
    batchNumber: data.batchNumber,
    subTotal: data.subtotal,
    totalQuantity: data.total_quantity,
    tax: data.tax,
    discount: data.discount,
    note: data.note,
    orderDate: Date.now(),
    orderStatus: 'UNPAID',
    totalAmount: data.total,
    progressStatus: 'PENDING',
  };

  const orderData = await Order.create(order);

  items.forEach(async (item) => {
    await OrderItem.create({
      orderId: orderData.id,
      menuItemDetailId: item.id,
      quantity: item.quantity,
      price: item.price,
      total: item.total
    });
  });

  const orderStatusLogs = {
    orderId: orderData.id,
    status: 'PENDING',
    createdBy: 1,
    updatedBy: 1,
    updatedAt: Date.now(),
    createdAt: Date.now(),
  };

  await OrderStatusLogs.create(orderStatusLogs);

  return apiResponse(res, 201, 'Review created successfully', data.orderNumber);
};
  
module.exports = {
  createOrderService,
  createCustomerOrderService
}
  