const SettingService = require('../services/settingService');

const getSetting = async (req, res) => {
    return SettingService.getSettingService({res});
}

module.exports = {
    getSetting
};