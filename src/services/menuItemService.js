const MenuItem = require('../models/menuItemModel');
const Menu = require('../models/menuModel');
const apiResponse = require('../utils/apiResponse');

const createMenuItemService = async ({res, name, menuId}) => {
    try{
        
        const menu = await Menu.findByPk(menuId);
        if(!menu){
            return apiResponse(res, 404, 'Menu not found');
        }

        const newRecord = await MenuItem.create({name, menuId});
        return apiResponse(res, 201, 'Menu Item created successfully', newRecord);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}

module.exports = {
    createMenuItemService
}