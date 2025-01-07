const apiResponse = require('../utils/apiResponse');
const MenuItemDetail  = require('../models/menuItemDetailModel');
const MenuItem = require('../models/menuItemModel');
const cloudinary = require('../config/cloudinary');
const sequelize = require('../config/db');
const menuItemDetailDTO = require('../dtos/menuItemDetailDTO');

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

        menuItems.forEach(menuItem => {
            menuItem.items.forEach(item => {
                item.status = item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase();
            });
        });

        return apiResponse(res, 200, 'Categories retrieved successfully', menuItems);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}

const createMenuDetailService = async ({res, menuItemDetails, menuItemId }) => {
    try{
        if(menuItemId == 0){
            return apiResponse(res, 400, 'you cannot create a menu item detail in all');
        }

        const menuItem = await MenuItem.findByPk(menuItemId);
        if(!menuItem){
            return apiResponse(res, 404, 'Menu Item not found');
        }

        const newRecords = [];
        const maxIdResult = await MenuItemDetail.findOne({
            attributes: [[sequelize.fn('MAX', sequelize.col('id')), 'maxId']],
          });
          let maxId = maxIdResult.dataValues.maxId || 0;

        for (const detail of menuItemDetails) {
            let imageUrl = detail.imageUrl;
            
            if (imageUrl.startsWith('data:image')) {
                const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
                  folder: 'contactless',
                  use_filename: true,
                });
                imageUrl = uploadResponse.secure_url;
              }
            detail.status = detail.status.toUpperCase();
        
            const newRecord = await MenuItemDetail.create({
                ...detail,
                id: maxId + 1,
                menuItemId,
                imageUrl,
            });
            maxId++;

            newRecords.push(menuItemDetailDTO(newRecord));
        }

        return apiResponse(res, 201, 'Menu Item Details created successfully', newRecords);
    }catch(error){
        console.log(error);
        return apiResponse(res, 500, error.message);
    }
}

const updateMenuDetailService = async ({ res, menuItemDetails }) => {
    try {
      let imageUrl = menuItemDetails.imageUrl;

      // Check if the imageUrl is a base64 string
      if (imageUrl.startsWith('data:image')) {
        const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
          folder: 'contactless',
          use_filename: true,
        });
        imageUrl = uploadResponse.secure_url;
      }
  
      menuItemDetails.status = menuItemDetails.status.toUpperCase();
  
      const updatedRecord = await MenuItemDetail.update({
        ...menuItemDetails,
        imageUrl,
      }, {
        where: {
          id: menuItemDetails.id,
        }
      });

      return apiResponse(res, 200, 'Menu Item Detail updated successfully', updatedRecord);
    } catch (error) {
      console.log(error);
      return apiResponse(res, 500, error.message);
    }
  };


module.exports = {
    getAllCategoriesMenuItemDetailService,
    createMenuDetailService,
    updateMenuDetailService,
}