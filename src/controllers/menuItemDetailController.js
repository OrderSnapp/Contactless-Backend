const MenuItemDetailService =  require('../services/menuItemDetailService');

const getCategoriesAndMenuItemDetails = async (req, res) => {
    return MenuItemDetailService.getAllCategoriesMenuItemDetailService({res});
}

const createMenuItemDetails = async (req, res) => {
    const {menuItemDetails,menuItemId} = req.body;
    return MenuItemDetailService.createMenuDetailService({res, menuItemDetails, menuItemId});
}

const updateMenuItemDetail = async (req, res) => {
    const {menuItemDetails} = req.body;
    return MenuItemDetailService.updateMenuDetailService({res, menuItemDetails});
}

module.exports = {
    getCategoriesAndMenuItemDetails,
    createMenuItemDetails,
    updateMenuItemDetail
}