const express = require('express');
const dashboardRouter = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

dashboardRouter.get('/get-dashboard-stats', dashboardController.getDashboardStats);
dashboardRouter.get('/get-daily-monitor-stats', dashboardController.getDailyMonitorStats);
dashboardRouter.get('/get-weekly-orders', dashboardController.getWeeklyOrders);
dashboardRouter.get('/get-categories-order', dashboardController.getCategoriesOrder);
dashboardRouter.get('/get-top-selling-items', dashboardController.getTopSellingItems);

// New route to get categories order by date
dashboardRouter.get('/get-categories-order-by-date', dashboardController.getCategoriesOrderByDate);
dashboardRouter.get('/get-top-selling-items-by-date', dashboardController.getTopSellingItemsByDate);
dashboardRouter.get('/get-sales-table-data', dashboardController.getTopSellingItemsByDateRange);

module.exports = dashboardRouter;