const Setting = require('../models/settingModel');
const apiResponse = require('../utils/apiResponse');

const getSettingService = async ({res}) => {
    try {
        const setting = await Setting.findOne();
        setting.darkMode = setting.darkMode == '1' ? true : false;
        return apiResponse(res, 200, 'Setting retrieved successfully', setting);
    } catch (error) {
        return apiResponse(res, 500, error.message);
    }
}

const updateSettingService = async ({req, res}) => {

    console.log('Start updateSettingService');
    try {
        const data = req.body
        const shopLogo = req.file;

        console.log('request body: ', data);
        console.log('uploaded file: ', shopLogo);

        let setting = await Setting.findByPk(1);
        if (!setting) {
            console.log('Setting not found');
            
            const payload = {
                id: 1,
                theme: data.theme,
                shopName: data.shopName,
                shopLogo: data.shopLogo,
                font: data.font,
                darkMode: data.darkMode == true ? '1' : '0',
                fontFamily: data.fontFamily,
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
        setting.fontFamily = data.fontFamily;
        setting.darkMode = data.darkMode == true ? '1' : '0';

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