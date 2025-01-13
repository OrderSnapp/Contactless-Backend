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

const deleteMenuItemDetail = async (req, res) => {
    const {menuItemDetailsId} = req.body;
    return MenuItemDetailService.deleteMenuDetailService({res, menuItemDetailsId});
}

module.exports = {
    getCategoriesAndMenuItemDetails,
    createMenuItemDetails,
    updateMenuItemDetail,
    deleteMenuItemDetail,
}