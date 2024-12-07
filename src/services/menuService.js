const Menu = require('../models/menuModel');
const apiResponse = require('../utils/apiResponse');

const createMenuService = async ({res,name}) => {
    try{
        const newRecord = await Menu.create({name});
        return apiResponse(res, 201, 'Menu created successfully', newRecord);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}
const getMenuService = async ({res,id}) => {
    try{
        const menu = await Menu.findByPk(id);
        return apiResponse(res, 200, 'Menu retrieved successfully', menu);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}
const getAllMenusService = async ({res}) => {
    try{
        const menus = await Menu.findAll();
        return apiResponse(res, 200, 'Menus retrieved successfully', menus);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}
const updateMenuService = async ({res,id,name}) => {
    try{
        const menu = await Menu.findByPk(id);
        if(!menu){
            return apiResponse(res, 404, 'Menu not found');
        }
        menu.name = name;
        menu.updatedAt = new Date();
        await menu.save();
        return apiResponse(res, 200, 'Menu updated successfully', menu);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}
const deleteMenuService = async ({res,id}) => {
    try{
        const menu = await Menu.findByPk(id);
        if(!menu){
            return apiResponse(res, 404, 'Menu not found');
        }
        await menu.destroy();
        return apiResponse(res, 200, 'Menu deleted successfully');
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}

module.exports = {
    createMenuService,
    getMenuService,
    getAllMenusService,
    updateMenuService,
    deleteMenuService
}