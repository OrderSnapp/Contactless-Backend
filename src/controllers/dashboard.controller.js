const dashboardService = require('../services/dashboard.service');

const getDashboardStats = async ({req, res}) => {
    return dashboardService.getDashboardStats({req, res});
};

const getDailyMonitorStats = async ({req, res}) => {
    return dashboardService.getDailyMonitorStats({req, res});
};

const getWeeklyOrders = async ({req, res}) => {
    return dashboardService.getWeeklyOrders({req, res});
};

const getCategoriesOrder = async ({req, res}) => {
    return dashboardService.getCategoriesOrder({req, res});
};

const getTopSellingItems = async ({req, res}) => {
    return dashboardService.getTopSellingItems({req, res});
}

const getCategoriesOrderByDate = async (req, res) => {
    return dashboardService.getCategoriesOrderByDate(req, res);
}

const getTopSellingItemsByDate = async (req, res) => {
    return dashboardService.getTopSellingItemsByDate(req, res);
}

const getTopSellingItemsByDateRange = async (req, res) => {
    return dashboardService.getTopSellingItemsByDateRange(req, res);
}

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