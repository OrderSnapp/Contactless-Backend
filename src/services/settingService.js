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

const updateSettingService = async ({req, res}) => {
    try {

        const data = req.body

        const setting = await Setting.findByPk(data.id);
        if (!setting) {
            return apiResponse(res, 404, 'Setting not found');
        }

        setting.theme = data.theme;
        setting.shopName = data.shopName;
        setting.shopLogo = data.shopLogo;
        setting.font = data.font;

        await setting.save();
        return apiResponse(res, 200, 'Setting updated successfully', setting);
    }
    catch (error) {
        return apiResponse(res, 500, error.message);
    }
}

module.exports = {
    getSettingService,
    updateSettingService
};