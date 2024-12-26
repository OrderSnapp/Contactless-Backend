const MenuItemDetailService =  require('../services/menuItemDetailService');

const getCategoriesAndMenuItemDetails = async (req, res) => {
    return MenuItemDetailService.getAllCategoriesMenuItemDetailService({res});
}

module.exports = {
    getCategoriesAndMenuItemDetails
}