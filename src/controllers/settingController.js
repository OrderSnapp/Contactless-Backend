const SettingService = require('../services/settingService');

const getSetting = async (req, res) => {
    return SettingService.getSettingService({res});
}

const updateSetting = async (req, res) => {
    return SettingService.updateSettingService({req, res});
}

module.exports = {
    getSetting,
    updateSetting
};