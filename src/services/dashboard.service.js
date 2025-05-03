const apiResponse = require('../utils/apiResponse');
const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const MenuItemDetail = require('../models/menuItemDetailModel');
const MenuItem = require('../models/menuItemModel');
const { fn, col, literal, Op } = require('sequelize');
const moment = require('moment');
const Payment = require('../models/paymentModel');
const Table = require('../models/tableModel');

const getDashboardStats = async ({req, res}) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    try {
        const orderRevenueData = await Order.findAll({
            attributes: [
                [fn('DATE', col('orderDate')), 'date'],
                [fn('SUM', col('totalAmount')), 'totalRevenue'],
                [fn('COUNT', col('id')), 'orderCount']
            ],
            where: {
                orderDate: {
                    [Op.between]: [yesterday, endOfToday]
                },
                orderStatus: 'PAID',
                progressStatus: 'COMPLETED'
            },
            group: [fn('DATE', col('orderDate'))],
            raw: true
        });
        
        const yesterdayFormatted = moment(yesterday).format('YYYY-MM-DD');
        const todayFormatted = moment(new Date()).format('YYYY-MM-DD');

        let revenueYesterday = 0;
        let revenueToday = 0;
        let orderCountYesterday = 0;
        let orderCountToday = 0;
        
        orderRevenueData.forEach(item => {
            if (item.date === yesterdayFormatted) {
                revenueYesterday = parseFloat(item.totalRevenue) || 0;
                orderCountYesterday = parseInt(item.orderCount) || 0;
            } else if (item.date === todayFormatted) {
                revenueToday = parseFloat(item.totalRevenue) || 0;
                orderCountToday = parseInt(item.orderCount) || 0;
            }
        });
        
        const avgOrderValueToday = orderCountToday > 0 ? revenueToday / orderCountToday : 0;
        const avgOrderValueYesterday = orderCountYesterday > 0 ? revenueYesterday / orderCountYesterday : 0;
        
        const formatNumber = (num) => {
            if (Number.isInteger(num)) {
                return num;
            }
            return parseFloat(num).toFixed(2);
        };

        const formatCurrency = (num) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(num);
        };
        
        const calculatePercentageWithTrend = (today, yesterday) => {
            let percentage = 0;
            let trend = 'neutral';
            
            if (yesterday > 0) {
                percentage = ((today - yesterday) / yesterday) * 100;
                trend = percentage > 0 ? 'increase' : percentage < 0 ? 'decrease' : 'neutral';
                return {
                    value: formatNumber(Math.abs(percentage)),
                    trend: trend
                };
            } else if (today > 0) {
                return {
                    value: 100,
                    trend: 'increase'
                };
            }
            
            return {
                value: 0,
                trend: 'neutral'
            };
        };

        const revenueChange = calculatePercentageWithTrend(revenueToday, revenueYesterday);
        const orderChange = calculatePercentageWithTrend(orderCountToday, orderCountYesterday);
        const avgOrderChange = calculatePercentageWithTrend(avgOrderValueToday, avgOrderValueYesterday);

        const dashboardStats = [
            {
                id: 1,
                value: formatCurrency(revenueToday),
                percentage: revenueChange.value,
                trend: revenueChange.trend,
                title: "Total Revenue",
                subtitle: "Since Yesterday",
                icon: "currency-circle-dollar"
            },
            {
                id: 2,
                value: orderCountToday,
                percentage: orderChange.value,
                trend: orderChange.trend,
                title: "Total Order",
                subtitle: "Since Yesterday",
                icon: "clipboard-text"
            },
            {
                id: 3,
                value: formatCurrency(avgOrderValueToday),
                percentage: avgOrderChange.value,
                trend: avgOrderChange.trend,
                title: "Average Order",
                subtitle: "Since Yesterday",
                icon: "call-bell"
            }
        ];

        return apiResponse(res, 200, 'Dashboard stats retrieved successfully', dashboardStats);
    } catch(err) {
        console.error(err);
        return apiResponse(res, 500, 'Internal server error');
    }
};

const getDailyMonitorStats = async ({req, res}) => {
    try{
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const ordersByStatus = await Order.findAll({
            attributes: [
                [fn('COUNT', col('id')), 'count'],
                [literal(`CASE 
                    WHEN "Order"."progressStatus" = 'CANCELLED' THEN 'canceled'
                    WHEN "Order"."progressStatus" = 'COMPLETED' AND "Order"."orderStatus" = 'PAID' THEN 'completed'
                    WHEN "Order"."progressStatus" = 'REJECTED' THEN 'rejected'
                    ELSE 'other'
                END`), 'status_category']
            ],
            where: {
                orderDate: {
                    [Op.between]: [today, endOfToday]
                }
            },
            group: ['status_category'],
            raw: true
        });

        const categories = [
            { id: 1, name: 'Total Completed Orders', amount: 0 },
            { id: 2, name: 'Total Rejected', amount: 0 },
            { id: 3, name: 'Total Cancelled', amount: 0 }
        ];

        ordersByStatus.forEach(item => {
            switch(item.status_category) {
                case 'canceled':
                    categories[2].amount = parseInt(item.count) || 0;
                    break;
                case 'completed':
                    categories[0].amount = parseInt(item.count) || 0;
                    break;
                case 'rejected':
                    categories[1].amount = parseInt(item.count) || 0;
                    break;
            }
        });

        return apiResponse(res, 200, 'Daily monitor stats by status retrieved successfully', categories);
    }
    catch(err){
        console.error(err);
        return apiResponse(res, 500, 'Internal server error');
    }
};

const getWeeklyOrders = async ({req, res}) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentDayOfWeek = moment(today).day();
    
    let startOfWeek, endOfWeek;
    
    if (currentDayOfWeek === 0) {
        startOfWeek = moment(today).subtract(6, 'days').startOf('day').toDate();
        endOfWeek = moment(today).endOf('day').toDate();
    } else {
        startOfWeek = moment(today).startOf('week').add(1, 'days').startOf('day').toDate();
        endOfWeek = moment(startOfWeek).add(6, 'days').endOf('day').toDate();
    }

    try {
        const weeklyOrders = await Order.findAll({
            attributes: [
                [fn('DATE', col('orderDate')), 'date'],
                [fn('COUNT', col('id')), 'count']
            ],
            where: {
                orderDate: {
                    [Op.between]: [startOfWeek, endOfWeek]
                },
                orderStatus: 'PAID',
                progressStatus: 'COMPLETED'
            },
            group: [fn('DATE', col('orderDate'))],
            order: [[col('date'), 'ASC']],
            raw: true
        });

        const allDaysOfWeek = [];
        const currentDate = moment(startOfWeek);
        const lastDay = moment(endOfWeek);
        
        while (currentDate <= lastDay) {
            allDaysOfWeek.push({
                date: currentDate.format('YYYY-MM-DD'),
                count: 0
            });
            currentDate.add(1, 'days');
        }

        weeklyOrders.forEach(order => {
            const orderDate = moment(order.date).format('YYYY-MM-DD');
            const dayIndex = allDaysOfWeek.findIndex(day => day.date === orderDate);
            
            if (dayIndex !== -1) {
                allDaysOfWeek[dayIndex].count = parseInt(order.count) || 0;
            }
        });

        const formattedResponse = [
            {
                name: 'Sales',
                data: allDaysOfWeek.map(day => day.count)
            }
        ];

        return apiResponse(res, 200, 'Weekly orders retrieved successfully', formattedResponse);
    } catch(err) {
        console.error(err);
        return apiResponse(res, 500, 'Internal server error');
    }
};

const getCategoriesOrder = async ({ req, res }) => {
    try {
        const startOfToday = moment().startOf('day').toDate();
        const endOfToday = moment().endOf('day').toDate();

        const orders = await Order.findAll({
            where: {
                orderStatus: 'PAID',
                progressStatus: 'COMPLETED',
                orderDate: {
                    [Op.between]: [startOfToday, endOfToday],
                },
            },
            attributes: ['id'],
        });

        const orderIds = orders.map(order => order.id);

        const orderDetails = await OrderDetail.findAll({
            where: {
                orderId: orderIds,
            },
            attributes: ['menuItemDetailId', [fn('SUM', col('quantity')), 'amount']],
            group: ['menuItemDetailId'],
            raw: true,
        });

        const menuItemDetailIds = orderDetails.map(detail => detail.menuItemDetailId);

        const items = await MenuItemDetail.findAll({
            where: {
                id: menuItemDetailIds,
            },
            attributes: ['id', 'menuItemId'],
            raw: true,
        });

        const menuItemIdMap = items.reduce((acc, item) => {
            acc[item.id] = item.menuItemId;
            return acc;
        }, {});

        const menuItemIds = items.map(item => item.menuItemId);
        const categories = await MenuItem.findAll({
            where: {
                id: menuItemIds,
            },
            attributes: ['id', 'name'],
            raw: true,
        });

        const categoryQuantities = orderDetails.reduce((acc, detail) => {
            const menuItemId = menuItemIdMap[detail.menuItemDetailId];
            const category = categories.find(cat => cat.id === menuItemId);
            if (category) {
                const categoryId = category.categoryId;
                if (!acc[categoryId]) {
                    acc[categoryId] = {
                        categoryId,
                        name: category.name,
                        amount: 0,
                    };
                }
                acc[categoryId].amount += parseInt(detail.amount, 10);
            }
            return acc;
        }, {});

        const finalCategories = Object.values(categoryQuantities);

        return apiResponse(res, 200, 'Categories order retrieved successfully', finalCategories);
    } catch (err) {
        console.error(err);
        return apiResponse(res, 500, 'Internal server error');
    }
};

const getTopSellingItems = async ({ req, res }) => {
    try {
        const startOfToday = moment().startOf('day').toDate();
        const endOfToday = moment().endOf('day').toDate();

        const limit = 10;

        const topItems = await OrderDetail.findAll({
            attributes: [
                'menuItemDetailId',
                [fn('SUM', col('quantity')), 'totalSold'],
                [fn('SUM', literal('quantity * "MenuItemDetail"."price"')), 'totalAmount'] // Total amount calculation
            ],
            include: [{
                model: Order,
                as: 'items',
                attributes: [],
                where: {
                    orderStatus: 'PAID',
                    progressStatus: 'COMPLETED',
                    orderDate: {
                        [Op.between]: [startOfToday, endOfToday] // Filter for today's orders
                    }
                },
                required: true
            }, {
                model: MenuItemDetail,
                attributes: ['name', 'imageUrl', 'price'],
                required: true
            }],
            group: ['menuItemDetailId', 'MenuItemDetail.id', 'MenuItemDetail.name', 'MenuItemDetail.imageUrl', 'MenuItemDetail.price'],
            order: [[fn('SUM', col('quantity')), 'DESC']],
            limit: parseInt(limit),
            raw: true,
            nest: true
        });

        const formattedItems = topItems.map(item => ({
            id: item.menuItemDetailId,
            name: item.MenuItemDetail.name,
            imageUrl: item.MenuItemDetail.imageUrl,
            quantity: parseInt(item.totalSold, 10),
            amount: parseFloat(item.totalAmount)
        }));

        return apiResponse(res, 200, 'Top selling items retrieved successfully', formattedItems);
    } catch (err) {
        console.error('Error getting top selling items:', err);
        return apiResponse(res, 500, `Server error: ${err.message}`);
    }
};

const getCategoriesOrderByDate = async (req, res ) => {
    console.log('getCategoriesOrderByDate called');
    console.log('Query:', req.query);

    try {
        const { dateFilter = 'today' } = req.query;

        let startDate, endDate;

        switch (dateFilter) {
            case 'today':
                startDate = moment().startOf('day').toDate();
                endDate = moment().endOf('day').toDate();
                break;
            case 'week':
                startDate = moment().startOf('week').toDate();
                endDate = moment().endOf('day').toDate();
                break;
            case 'month':
                startDate = moment().subtract(1, 'month').toDate();
                endDate = moment().endOf('day').toDate();
                break;
            default:
                startDate = moment().startOf('day').toDate();
                endDate = moment().endOf('day').toDate();
        }

        const orders = await Order.findAll({
            where: {
                orderStatus: 'PAID',
                progressStatus: 'COMPLETED',
                orderDate: {
                    [Op.between]: [startDate, endDate],
                },
            },
            attributes: ['id'],
        });

        const orderIds = orders.map(order => order.id);

        const orderDetails = await OrderDetail.findAll({
            where: {
                orderId: orderIds,
            },
            attributes: ['menuItemDetailId', [fn('SUM', col('quantity')), 'amount']],
            group: ['menuItemDetailId'],
            raw: true,
        });

        const menuItemDetailIds = orderDetails.map(detail => detail.menuItemDetailId);

        const items = await MenuItemDetail.findAll({
            where: {
                id: menuItemDetailIds,
            },
            attributes: ['id', 'menuItemId'],
            raw: true,
        });

        const menuItemIdMap = items.reduce((acc, item) => {
            acc[item.id] = item.menuItemId;
            return acc;
        }, {});

        const menuItemIds = items.map(item => item.menuItemId);
        const categories = await MenuItem.findAll({
            where: {
                id: menuItemIds,
            },
            attributes: ['id', 'name'],
            raw: true,
        });

        const categoryQuantities = orderDetails.reduce((acc, detail) => {
            const menuItemId = menuItemIdMap[detail.menuItemDetailId];
            const category = categories.find(cat => cat.id === menuItemId);
            if (category) {
                const categoryId = category.categoryId;
                if (!acc[categoryId]) {
                    acc[categoryId] = {
                        categoryId,
                        name: category.name,
                        amount: 0,
                    };
                }
                acc[categoryId].amount += parseInt(detail.amount, 10);
            }
            return acc;
        }, {});

        const finalCategories = Object.values(categoryQuantities);

        return apiResponse(res, 200, 'Categories order retrieved successfully', finalCategories);
    } catch (err) {
        console.error(err);
        return apiResponse(res, 500, 'Internal server error');
    }
};

const getTopSellingItemsByDate = async (req, res) => {
    console.log('getTopSellingItemsByDate called');
    console.log('Query:', req.query);

    const { dateFilter = 'today' } = req.query;
    try {
        let startDate, endDate;

        switch (dateFilter) {
            case 'today':
                startDate = moment().startOf('day').toDate();
                endDate = moment().endOf('day').toDate();
                break;
            case 'week':
                startDate = moment().startOf('week').toDate();
                endDate = moment().endOf('day').toDate();
                break;
            case 'month':
                startDate = moment().subtract(1, 'month').toDate();
                endDate = moment().endOf('day').toDate();
                break;
            default:
                startDate = moment().startOf('day').toDate();
                endDate = moment().endOf('day').toDate();
        }

        const limit = 10;

        const topItems = await OrderDetail.findAll({
            attributes: [
                'menuItemDetailId',
                [fn('SUM', col('quantity')), 'totalSold'],
                [fn('SUM', literal('quantity * "MenuItemDetail"."price"')), 'totalAmount'] 
            ],
            include: [{
                model: Order,
                as: 'items',
                attributes: [],
                where: {
                    orderStatus: 'PAID',
                    progressStatus: 'COMPLETED',
                    orderDate: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                required: true
            }, {
                model: MenuItemDetail,
                attributes: ['name', 'imageUrl', 'price'],
                required: true
            }],
            group: ['menuItemDetailId', 'MenuItemDetail.id', 'MenuItemDetail.name', 'MenuItemDetail.imageUrl', 'MenuItemDetail.price'],
            order: [[fn('SUM', col('quantity')), 'DESC']],
            limit: parseInt(limit),
            raw: true,
            nest: true
        });

        const formattedItems = topItems.map(item => ({
            id: item.menuItemDetailId,
            name: item.MenuItemDetail.name,
            imageUrl: item.MenuItemDetail.imageUrl,
            quantity: parseInt(item.totalSold, 10),
            amount: parseFloat(item.totalAmount)
        }));

        return apiResponse(res, 200, 'Top selling items retrieved successfully', formattedItems);
    } catch (err) {
        console.error('Error getting top selling items:', err);
        throw err;
    }
};

const getTopSellingItemsByDateRange = async (req, res) => {
    console.log('getTopSellingItemsByDateRange called');
    console.log('Query:', req.query);

    try {
        const { page = 1, limit = 10, period = 'today', sortOrder='desc', sortField='id' } = req.query;
        const parsedPage = parseInt(page) || 1;
        const parsedLimit = parseInt(limit) || 10;
        const offset = (parsedPage - 1) * parsedLimit;

        let startDate, endDate;

        switch (period) {
            case 'today':
                startDate = moment().startOf('day').toDate();
                endDate = moment().endOf('day').toDate();
                break;
            case 'week':
                startDate = moment().startOf('week').toDate();
                endDate = moment().endOf('day').toDate();
                break;
            case 'month':
                startDate = moment().subtract(1, 'month').toDate();
                endDate = moment().endOf('day').toDate();
                break;
            default:
                startDate = moment().startOf('day').toDate();
                endDate = moment().endOf('day').toDate();
        }

        const orders = await Order.findAll({
            attributes: ['id','orderNumber','totalQuantity','orderDate','subTotal','tax','discount','note'],
            include: [
                {
                    model: Payment,
                    attributes: ['paymentDate', 'paymentMethod', 'paymentAmount', 'paymentStatus'],
                },
                {
                    model:Table,
                    as: 'table',
                    attributes:['id','name'],
                }
            ],
            where:{
                orderStatus: 'PAID',
                    progressStatus: 'COMPLETED',
                    orderDate: {
                        [Op.between]: [startDate, endDate]
                    }
            },
            limit: parsedLimit,
            offset: offset,
            order: [[sortField || 'createdAt', sortOrder || 'DESC']],
        });

        const totalOrders = await Order.count({
            where: {
                orderStatus: 'PAID',
                progressStatus: 'COMPLETED',
                orderDate: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        const totals = await OrderDetail.findOne({
            attributes: [
                [fn('SUM', col('quantity')), 'totalOrderItems'],
                [fn('SUM', literal('quantity * price')), 'saleValue']
            ],
            include: {
                model: Order,
                as: 'items',
                where: {
                    orderStatus: 'PAID',
                    progressStatus: 'COMPLETED',
                    orderDate: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                attributes: [] 
            },
            raw: true
        });

        return apiResponse(res, 200, 'Orders retrieved successfully', {
            orders,
            totals: {
                totalOrders,
                totalOrderItems: parseInt(totals?.totalOrderItems || 0),
                saleValue: parseFloat(totals?.saleValue || 0).toFixed(2)
            },
            pagination: {
                page: parsedPage,
                limit: parsedLimit,
                total: totalOrders,
                totalPages: Math.ceil(totalOrders / parsedLimit),
            }
        });
    } catch (error) {
        console.error('Error in getTopSellingItemsByDateRange:', error);
        return apiResponse(res, 500, 'Error retrieving orders', null);
    }
};


module.exports = {
    getDashboardStats,
    getDailyMonitorStats,
    getWeeklyOrders,
    getCategoriesOrder,
    getTopSellingItems,
    getCategoriesOrderByDate,
    getTopSellingItemsByDate,
    getTopSellingItemsByDateRange
};
