const MenuItemService =  require('../services/menuItemService');

const createMenuItem = async (req, res) => {
    const { name, menuId, icon } = req.body;
    return MenuItemService.createMenuItemService({res, name, menuId, icon});
}

const getMenuItems = async (req, res) => {
    const { menuId } = req.params;
    return MenuItemService.getMenuItemsService({res, menuId});
}

const updateMenuItem = async (req, res) => {
    const { id } = req.params;
    const { name, menuId, icon } = req.body;
    return MenuItemService.updateMenuItemService({res, id, name, menuId, icon});
}

module.exports = {
    createMenuItem,
    getMenuItems,
    updateMenuItem
}