const MenuService = require('../services/menuService');

const createMenu = async (req, res) => {
    const { name } = req.body;
    return MenuService.createMenuService({res, name});
}
const getMenus = async (req, res) => {
    return MenuService.getAllMenusService({res});
}

const getMenu = async (req, res) => {
    const { id } = req.params;
    return MenuService.getMenuService({res, id});
}

const updateMenu = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    return MenuService.updateMenuService({res, id, name});
}

const deleteMenu = async (req, res) => {
    const { id } = req.params;
    return MenuService.deleteMenuService({res, id});
}

module.exports = {
    createMenu,
    getMenus,
    getMenu,
    updateMenu,
    deleteMenu
};