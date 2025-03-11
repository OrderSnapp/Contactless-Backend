const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const apiResponse = require('../utils/apiResponse');

const createOrderService = async ({ req, res }) => {
    try {
      const data = req.body;

      const tableBusy = await Order.findOne({
        where: {
          tableId: data.tableNumber,
          orderStatus: 'PENDING',
        },
      });

      if(tableBusy) {
        return apiResponse(res, 400, 'Table is already busy');
      }

      if (!data.items || data.items.length === 0) {
        return apiResponse(res, 400, 'Items are required');
      }

      const order = await Order.create({
        tableId: data.tableNumber,
        orderStatus: 'PENDING',  //payment status
        orderApproved: 1,         // cashier approval
        progressStatus: 'KITCHEN',  //kitchen status
        orderNumber: data.orderNumber,
        batchNumber: data.batchNumber,
        orderDate: new Date(),
        subTotal: data.subtotal,
        tax: data.tax,
        discount: data?.discount || 0,
        note: data.note,
        totalAmount: data.total,
        totalQuantity: data.total_quantity,
      });

      for (const item of data.items) {

        if (!item.id || !item.quantity) {
          return apiResponse(res, 400, 'MenuItemDetailId and Quantity are required');
        }

        await OrderDetail.create({
          orderId: order.id,
          menuItemDetailId: item.id,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        });
      }
  
      return apiResponse(res, 200, 'Order created successfully');
    } catch (error) {
        console.error('Error in createOrderService', error);
      return apiResponse(res, 500, error.message);
    }
  };
  
  module.exports = {
    createOrderService,
  };
  