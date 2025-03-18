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

    console.log('Start updateSettingService');
    

    try {

        const data = req.body

        console.log('request body: ', data);

        let setting = await Setting.findByPk(data.id);
        if (!setting) {

            console.log('Setting not found');

            const payload = {
                theme: data.theme,
                shopName: data.shopName,
                shopLogo: data.shopLogo,
                font: data.font,
            }

            console.log('Setting not found, creating new setting');
            setting = await Setting.create(payload);

            console.log('Setting created successfully with payload: ', payload);
            
            return apiResponse(res, 200, 'Setting created successfully', setting);
        }

        setting.theme = data.theme;
        setting.shopName = data.shopName;
        setting.shopLogo = data.shopLogo;
        setting.font = data.font;

        await setting.save();
        return apiResponse(res, 200, 'Setting updated successfully', setting);
    }
    catch (error) {
        console.log('Error: ', error.message);
        return apiResponse(res, 500, error.message);
    }
}

module.exports = {
    getSettingService,
    updateSettingService
};