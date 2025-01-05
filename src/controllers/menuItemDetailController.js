const MenuItemDetailService =  require('../services/menuItemDetailService');

const getCategoriesAndMenuItemDetails = async (req, res) => {
    return MenuItemDetailService.getAllCategoriesMenuItemDetailService({res});
}

const createMenuItemDetails = async (req, res) => {
    const {menuItemDetails,menuItemId} = req.body;
    return MenuItemDetailService.createMenuDetailService({res, menuItemDetails, menuItemId});
}

module.exports = {
    getCategoriesAndMenuItemDetails,
    createMenuItemDetails
}