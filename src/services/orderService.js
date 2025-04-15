const apiResponse = require('../utils/apiResponse');
const Order = require('../models/orderModel');
const OrderStatusLogs = require('../models/orderStatusLogsModel');
const OrderItem = require('../models/orderDetailModel');
const MenuItemDetail = require('../models/menuItemDetailModel');
const Table = require('../models/tableModel');

const createOrderService = async ({ req, res }) => {
  return apiResponse(res, 201, 'Review created successfully');
};

const createCustomerOrderService = async ({ req, res }) => {
  const data = req.body;
  const items = data.items;

  console.log(data);

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

const getAllOrdersByStatusService = async ({ req, res }) => {
  const { status } = req.params;

  console.log('Fetching orders with status:', status);
  
  const statusMapping = {
    pending: 'PENDING',
    accepted: 'ACCEPTED',
    cooking: 'COOKING',
    ready: 'COOKED'
  };
  
  const dbStatus = statusMapping[status];
  
  if (!dbStatus) {
    return apiResponse(res, 400, 'Invalid status parameter. Must be pending, cooking, or ready');
  }

  const orders = await Order.findAll({
    attributes: ['id', 'orderNumber', 'totalAmount', ['orderDate', 'orderTime'], 'progressStatus'],
    include: [
      {
        model: OrderItem,
        as: 'items',
        attributes: ['id', 'quantity', 'price', 'total'],
        include: [
          {
            model: MenuItemDetail,
            attributes: ['name'],
          },
        ],
      },
      {
        model: Table,
        as: 'table',
        attributes: ['id', ['number', 'tableNumber']],
      },
    ],
    where: {
      progressStatus: dbStatus,
      orderStatus: 'UNPAID',
    },
  });

  const transformedOrders = orders.map(order => {
    const transformedItems = order.items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
      name: item.MenuItemDetail?.name,
    }));
    
    return {
      ...order.toJSON(),
      items: transformedItems,
    };
  });

  return apiResponse(res, 200, `${status} orders retrieved successfully`, transformedOrders);
};

const getProgressOrderStatusService = async ({ req, res }) => {

  console.log('Fetching order status counts...');
  
  try{
    const pendingCount = await Order.count({
      where: { 
        progressStatus: 'PENDING',
        orderStatus: 'UNPAID'
       }
    });

    const acceptedCount = await Order.count({
      where: { 
          progressStatus: 'ACCEPTED',
          orderStatus: 'UNPAID',
       }
    });
    
    const cookingCount = await Order.count({
      where: { 
        progressStatus: 'COOKING',
        orderStatus: 'UNPAID'
      }
    });
    
    const cookedCount = await Order.count({
      where: { 
        progressStatus: 'COOKED',
        orderStatus: 'UNPAID'
      }
    });
  
    const orderStatusCounts = {
      pending: pendingCount,
      accepted: acceptedCount,
      cooking: cookingCount,
      ready: cookedCount
    };
  
    return apiResponse(res, 200, 'Order status counts retrieved successfully', orderStatusCounts);
  }catch(err){
    console.error('Error retrieving order status counts:', err);
    return apiResponse(res, 500, 'Internal server error');
  }
};

const updateOrderStatusService = async ({ req, res }) => {
  const { orderNumber } = req.params;
  const { status } = req.body;

  console.log(status);
  
  const order = await Order.findOne({ where: { orderNumber } });
  
  if (!order) {
    return apiResponse(res, 404, 'Order not found');
  }

  const statusMapping = {
    accepted: 'ACCEPTED',
    cooking: 'COOKING',
    ready : 'COOKED',
    cancel: 'CANCELLED',
  };

  order.progressStatus = statusMapping[status];
  
  await order.save();

  const orderStatusLogs = {
    orderId: order.id,
    status: statusMapping[status],
    createdBy: 1,
    updatedBy: 1,
    updatedAt: Date.now(),
    createdAt: Date.now(),
  };

  await OrderStatusLogs.create(orderStatusLogs);

  return apiResponse(res, 200, 'Order status updated successfully');
}

const getAllKitchenStatusService = async ({ req, res }) => {
  try {
    const orders = await Order.findAll({
      attributes: ['id','orderNumber','createdAt', 'progressStatus'],
      include: [
        {
          model: OrderItem,
          as: 'items',
          attributes: ['id', 'quantity'],
          include: [
            {
              model: MenuItemDetail,
              attributes: ['id', 'name'],
            },
          ],
        },
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'number'],
        },
      ],
      where: {
        progressStatus: ['ACCEPTED', 'COOKING', 'COOKED'],
        orderStatus: 'UNPAID',
      },
    });

    const statusMapping = {
      'ACCEPTED': 'pending',
      'COOKING': 'cooking',
      'COOKED': 'ready'
    };

    const result = {
      pending: [],
      cooking: [],
      ready: []
    };

    orders.forEach(order => {
      const plainOrder = order.get({ plain: true });
      
      const orderDate = new Date(plainOrder.createdAt);
      const formattedTime = `${orderDate.getHours()}:${String(orderDate.getMinutes()).padStart(2, '0')}`;
      
      const status = statusMapping[plainOrder.progressStatus];
      
      const formattedOrder = {
        id: plainOrder.id,
        orderNumber: plainOrder.orderNumber,
        table: {
          id: plainOrder.table.id,
          number: plainOrder.table.number
        },
        items: plainOrder.items.map(item => ({
          name: item.MenuItemDetail.name,
          quantity: item.quantity
        })),
        time: formattedTime,
        priority: 'normal'
      };
      
      result[status].push(formattedOrder);
    });

    return apiResponse(res, 200, 'Kitchen status retrieved successfully', result);
  } catch (err) {
    console.error('Error retrieving kitchen status:', err);
    return apiResponse(res, 500, 'Internal server error');
  }
};
  
module.exports = {
  createOrderService,
  createCustomerOrderService,
  getAllOrdersByStatusService,
  getProgressOrderStatusService,
  updateOrderStatusService,
  getAllKitchenStatusService
}
  