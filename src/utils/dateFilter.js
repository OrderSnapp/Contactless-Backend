/**
 * Parse date filter string and return start and end date objects
 * @param {string} dateFilter - 'today', 'week', or 'month'
 * @returns {Object} Object containing startDate and endDate
 */
const getDateRangeFromFilter = (dateFilter) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let startDate = new Date(today);
    let endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);
    
    switch (dateFilter) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(today.getDate() - 30);
        break;
      // 'today' is default, startDate is already set to today
    }
    
    return {
      startDate,
      endDate
    };
  };
  
  module.exports = { getDateRangeFromFilter };