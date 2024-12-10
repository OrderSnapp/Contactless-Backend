const MenuItem = require('../models/menuItemModel');
const Menu = require('../models/menuModel');
const apiResponse = require('../utils/apiResponse');
const menuItemDTO = require('../dtos/menuItemDTO');

const createMenuItemService = async ({res, name, menuId, icon}) => {
    try{
        
        const menu = await Menu.findByPk(menuId);
        if(!menu){
            return apiResponse(res, 404, 'Menu not found');
        }

        const newRecord = await MenuItem.create({name, menuId, icon});
        return apiResponse(res, 201, 'Menu Item created successfully', newRecord);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}

const getMenuItemsService = async ({res, menuId}) => {
    try{
        const menu = await Menu.findByPk(menuId);
        if(!menu){
            return apiResponse(res, 404, 'Menu not found');
        }

        const menuItems = await MenuItem.findAll({where: {menuId}});
        const newMenuItems = menuItems.map(menuItemDTO);

        return apiResponse(res, 200, 'Menu Items retrieved successfully', newMenuItems);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}
const updateMenuItemService = async ({res, id, name, menuId, icon}) => {
    try{
        const menuItem = await MenuItem.findByPk(id);
        if(!menuItem){
            return apiResponse(res, 404, 'Menu Item not found');
        }

        const menu = await Menu.findByPk(menuId);
        if(!menu){
            return apiResponse(res, 404, 'Menu not found');
        }

        menuItem.name = name;
        menuItem.menuId = menuId;
        menuItem.icon = icon;
        await menuItem.save();

        return apiResponse(res, 200, 'Menu Item updated successfully', menuItem);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}

module.exports = {
    createMenuItemService,
    getMenuItemsService,
    updateMenuItemService
}