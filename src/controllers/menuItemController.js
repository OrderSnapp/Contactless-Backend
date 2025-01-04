const MenuItemService =  require('../services/menuItemService');

const createMenuItem = async (req, res) => {
    const { name, icon } = req.body;
    return MenuItemService.createMenuItemService({res, name, icon});
}

const getMenuItems = async (req, res) => {
    const { menuId } = req.params;
    return MenuItemService.getMenuItemsService({res, menuId});
}

const updateMenuItem = async (req, res) => {
    const { id } = req.params;
    const { name, icon } = req.body;
    return MenuItemService.updateMenuItemService({res, id, name, icon});
}

const deleteMenuItem = async (req, res) => {
    const { id } = req.params;
    return MenuItemService.deleteMenuItemService({res, id});
}

module.exports = {
    createMenuItem,
    getMenuItems,
    updateMenuItem,
    deleteMenuItem
}