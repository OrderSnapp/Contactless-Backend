const Setting = require('../models/settingModel');
const apiResponse = require('../utils/apiResponse');

const getSettingService = async ({res}) => {
    try {
        const setting = await Setting.findOne();
        return apiResponse(res, 200, 'Setting retrieved successfully', setting);
    } catch (error) {
        return apiResponse(res, 500, error.message);
    }
}

exports.getSettingService = getSettingService;