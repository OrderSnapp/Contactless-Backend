const MenuItemService =  require('../services/menuItemService');

const createMenuItem = async (req, res) => {
    const { name, menuId } = req.body;
    return MenuItemService.createMenuItemService({res, name, menuId});
}

module.exports = {
    createMenuItem
}