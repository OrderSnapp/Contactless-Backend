const apiResponse = require('../utils/apiResponse');
const Order = require('../models/orderModel');
const OrderStatusLogs = require('../models/orderStatusLogsModel');
const OrderItem = require('../models/orderDetailModel');
const MenuItemDetail = require('../models/menuItemDetailModel');
const Table = require('../models/tableModel');
const Payment = require('../models/paymentModel');
const { Op } = require('sequelize');
const sequelize = require('../config/db');
const OrderDetail = require('../models/orderDetailModel');

const createOrderService = async ({ req, res }) => {
  const data = req.body;
  const items = data.items;
  const currentDate = new Date();

  try{

    const table = await Table.findOne({
      where:{
        id: data.table.id
      }
    })
  
    if(table){
      return apiResponse(res, 400, 'Table already exists',null);
    }
    
    const order = {
      tableId: data.table.id,
      orderNumber: data.orderNumber,
      batchNumber: data.batchNumber,
      subTotal: data.subtotal,
      totalQuantity: data.total_quantity,
      tax: data.tax,
      discount: data.discount,
      note: data.note,
      orderDate: currentDate,
      orderStatus: 'UNPAID',
      totalAmount: data.total,
      progressStatus: 'ACCEPTED',
  }

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
    updatedAt: currentDate,
    createdAt: currentDate,
  };

  await OrderStatusLogs.create(orderStatusLogs);
  
    return apiResponse(res, 201, 'Review created successfully',data.orderNumber);
  }catch(err){
    console.error('Error creating order:', err);
    return apiResponse(res, 500, 'Internal server error');
  }
};

const createCustomerOrderService = async ({ req, res }) => {
  const data = req.body;
  const items = data.items;

  try{
    const table = await Table.findOne({
      where:{
        id: data.table.tableNumber,
      }
    })
  
    if(table){
      return apiResponse(res, 400, 'Table already exists',null);
    }
  
    console.log(data.table.tableNumber);
  
   const order = {
      tableId: data.table.tableNumber,
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
  }catch(err){
    console.error('Error creating customer order:', err);
    return apiResponse(res, 500, 'Internal server error');
  }
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

  try{
    const orders = await Order.findAll({
      attributes: ['id', 'orderNumber', ['totalAmount','total'], ['orderDate', 'orderTime'], 'progressStatus'],
      include: [
        {
          model: OrderItem,
          as: 'items',
          attributes: ['id', 'quantity', 'price', 'total'],
          include: [
            {
              model: MenuItemDetail,
              attributes: ['name','imageUrl'],
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
        tableId: { [Op.not]: null }
      },
    });
  
    const transformedOrders = orders.map(order => {
      const transformedItems = order.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        total: item.totalAmount,
        name: item.MenuItemDetail?.name,
        imageUrl: item.MenuItemDetail?.imageUrl,
      }));
      
      return {
        ...order.toJSON(),
        items: transformedItems,
      };
    });
  
    return apiResponse(res, 200, `${status} orders retrieved successfully`, transformedOrders);
  }
  catch(err){
    console.error('Error retrieving orders:', err);
    return apiResponse(res, 500, 'Internal server error');
  }
};

const getProgressOrderStatusService = async ({ req, res }) => {

  console.log('Fetching order status counts...');
  
  try{
    const pendingCount = await Order.count({
      where: { 
        progressStatus: 'PENDING',
        orderStatus: 'UNPAID',
        tableId: { [Op.not]: null }
       }
    });

    const acceptedCount = await Order.count({
      where: { 
          progressStatus: 'ACCEPTED',
          orderStatus: 'UNPAID',
          tableId: { [Op.not]: null }
       }
    });
    
    const cookingCount = await Order.count({
      where: { 
        progressStatus: 'COOKING',
        orderStatus: 'UNPAID',
        tableId: { [Op.not]: null }
      }
    });
    
    const cookedCount = await Order.count({
      where: { 
        progressStatus: 'COOKED',
        orderStatus: 'UNPAID',
        tableId: { [Op.not]: null }
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
  
  try{
    const order = await Order.findOne({ where: { orderNumber } });
  
  if (!order) {
    return apiResponse(res, 404, 'Order not found');
  }

  const statusMapping = {
    reject:'REJECTED',
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
  catch(err){
    console.error('Error updating order status:', err);
    return apiResponse(res, 500, 'Internal server error');
  }
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
        tableId: { [Op.not]: null }
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
      const localDate = new Date(orderDate.getTime() + (7 * 60 * 60 * 1000)); 
      const formattedTime = `${localDate.getHours()}:${String(localDate.getMinutes()).padStart(2, '0')}`;
      
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

const getNewPendingOrderNotificationService = async ({req,res}) => {
  try {
    const pendingOrders = await Order.findAll({
      attributes: ['id','orderNumber', ['orderDate','orderTime']],
      where: {
        progressStatus: 'PENDING',
        orderStatus: 'UNPAID',
        tableId: { [Op.not]: null }
      },
      include: [
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'number'],
        },
      ],
    }); 

    const formattedPendingOrders = pendingOrders.map(order => {
      const plainOrder = order.get({ plain: true });
      const orderDate = new Date(plainOrder.orderTime);
      const localDate = new Date(orderDate.getTime() + (7 * 60 * 60 * 1000));
      const formattedTime = `${localDate.getHours()}:${String(localDate.getMinutes()).padStart(2, '0')}`;
      
      return {
        id: plainOrder.id,
        orderNumber: plainOrder.orderNumber,
        tableNumber: plainOrder.table.number,
        orderTime: formattedTime,
      };
    });

    return apiResponse(res, 200, 'New pending order notification retrieved successfully', formattedPendingOrders);
  } catch (error) {
    console.error('Error fetching new pending order notification:', error);
    return apiResponse(res, 500, 'Internal server error');
  }
};

const getOrderHistoryService = async (req, res) => {
  console.log('Fetching order history...');
  console.log(req.query);

  const {
    page = 1,
    limit = 10,
    sortOrder = 'desc',
    search = '',
    start = '',
    end = '',
  } = req.query;

  const status = req.query.status;
  let { sortField = 'orderDate' } = req.query;

  console.log('status ', status);

  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const offset = (parsedPage - 1) * parsedLimit;

  const whereClause = {};
  whereClause.tableId = { [Op.not]: null };

  if (start || end) {
    const dateFilter = {};
  
    // If both dates are the same, search within that whole local day
    if (start && end && start === end) {
      const dayStart = new Date(start);
      dayStart.setHours(0, 0, 0, 0);
      dayStart.setHours(dayStart.getHours() - 7); // Convert to UTC
  
      const dayEnd = new Date(end);
      dayEnd.setHours(23, 59, 59, 999);
      dayEnd.setHours(dayEnd.getHours() - 7); // Convert to UTC
  
      dateFilter[Op.between] = [dayStart, dayEnd];
    } else {
      if (start) {
        const startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);
        startDate.setHours(startDate.getHours() - 7); // Local to UTC
        dateFilter[Op.gte] = startDate;
      }
  
      if (end) {
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);
        endDate.setHours(endDate.getHours() - 7); // Local to UTC
        dateFilter[Op.lte] = endDate;
      }
    }
  
    whereClause.orderDate = dateFilter;
  }
  
  if (search) {
    whereClause[Op.or] = [
      { orderNumber: { [Op.eq]: search } },
    ];
    
  }

  if (sortField === 'time' || !sortField) {
    sortField = 'orderDate';
  }

  const statusMap = {
    Completed: 'COMPLETED',
    Cancelled: 'CANCELLED',
    Rejected: 'REJECTED',
  };
  
  if (status && status !== 'All Statuses' && statusMap[status]) {
    whereClause.progressStatus = statusMap[status];
  }

  try {
    const orders = await Order.findAll({
      attributes: [
        'id',
        'orderNumber',
        'totalQuantity',
        ['totalAmount','total'],
        'orderDate',
        'subTotal',
        'tax',
        'discount',
        'note',
        'orderStatus',
        'progressStatus',
      ],
      include: [
        {
          model: Payment,
          attributes: ['paymentDate', 'paymentMethod', 'paymentAmount', 'paymentStatus'],
        },
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'name'],
        },
      ],
      where: whereClause,
      limit: parsedLimit,
      offset,
      order: [sequelize.literal(`"${sortField}" ${sortOrder}`)],
    });

    const totalOrders = await Order.count({ where: whereClause });

    // console.log('Total orders:', orders);

    return apiResponse(res, 200, 'Orders History retrieved successfully', {
      orders,
      totals: {},
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total: totalOrders,
        totalPages: Math.ceil(totalOrders / parsedLimit),
      },
    });
  } catch (err) {
    console.error('Error fetching order history:', err);
    return apiResponse(res, 500, 'Internal server error');
  }
};

const getOrderItemsByOrderId = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch order-level notes (assuming the `note` field is in Order)
    const order = await Order.findByPk(id);

    const orderItems = await OrderDetail.findAll({
      attributes: ['quantity', 'total', 'price'],
      where: { orderId: id },
      include: [
        {
          model: MenuItemDetail,
          attributes: ['id', 'name']
        }
      ]
    });

    const formattedItems = orderItems.map((item, index) => ({
      id: item.MenuItemDetail?.id || index + 1,
      name: item.MenuItemDetail?.name || 'Unknown item',
      quantity: item.quantity,
      unitPrice: `$${parseFloat(item.price).toFixed(2)}`,
      total: `$${parseFloat(item.total).toFixed(2)}`,
      notes: order?.note || '' 
    }));

    return apiResponse(res, 200, 'Orders Detail retrieved successfully', formattedItems);
  } catch (err) {
    console.error('Error fetching getOrderItemsByOrderId:', err);
    return apiResponse(res, 500, 'Internal server error');
  }
};
  
module.exports = {
  createOrderService,
  createCustomerOrderService,
  getAllOrdersByStatusService,
  getProgressOrderStatusService,
  updateOrderStatusService,
  getAllKitchenStatusService,
  getNewPendingOrderNotificationService,
  getOrderHistoryService,
  getOrderItemsByOrderId
}
  