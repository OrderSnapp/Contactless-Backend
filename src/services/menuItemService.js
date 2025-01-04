const MenuItem = require('../models/menuItemModel');
const Menu = require('../models/menuModel');
const apiResponse = require('../utils/apiResponse');
const menuItemDTO = require('../dtos/menuItemDTO');

const createMenuItemService = async ({res, name, icon}) => {
    try{ 
        const menu = await Menu.findOne({ where: { default: true } });;
        if(!menu){
            return apiResponse(res, 404, 'Menu not found');
        }

        const newRecord = await MenuItem.create({name, icon, menuId: menu.id});
        return apiResponse(res, 201, 'Menu Item created successfully', newRecord);
    }catch(error){
        console.log(error);
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
const updateMenuItemService = async ({res, id, name, icon}) => {
    try{
        const menuItem = await MenuItem.findByPk(id);
        if(!menuItem){
            return apiResponse(res, 404, 'Menu Item not found');
        }

        menuItem.name = name;
        menuItem.icon = icon;
        await menuItem.save();

        return apiResponse(res, 200, 'Menu Item updated successfully');
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}

const deleteMenuItemService = async ({res, id}) => {
    try{
        const menuItem = await MenuItem.findByPk(id);
        if(!menuItem){
            return apiResponse(res, 404, 'Menu Item not found');
        }

        await menuItem.destroy();
        return apiResponse(res, 204, 'Menu Item deleted successfully');
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}

module.exports = {
    createMenuItemService,
    getMenuItemsService,
    updateMenuItemService,
    deleteMenuItemService
}