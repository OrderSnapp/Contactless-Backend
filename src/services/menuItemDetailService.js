const apiResponse = require('../utils/apiResponse');
const MenuItemDetail  = require('../models/menuItemDetailModel');
const MenuItem = require('../models/menuItemModel');

const getAllCategoriesMenuItemDetailService = async ({res}) => {
    try{

        const menuItems = await MenuItem.findAll({
            attributes: ['id', 'name', 'icon'],
            include: [{
                model: MenuItemDetail,
                as: 'items',
                attributes: ['id', 'name', 'imageUrl', 'price', 'status', 'ingredient'],
            }],
        });

        return apiResponse(res, 200, 'Categories retrieved successfully', menuItems);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}

module.exports = {
    getAllCategoriesMenuItemDetailService
}