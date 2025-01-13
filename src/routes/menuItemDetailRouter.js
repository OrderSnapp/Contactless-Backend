const express = require('express');
const menuItemDetailRouter = express.Router();

const menuItemDetailController = require('../controllers/menuItemDetailController');

menuItemDetailRouter.get('', menuItemDetailController.getCategoriesAndMenuItemDetails);
menuItemDetailRouter.post('', menuItemDetailController.createMenuItemDetails);
menuItemDetailRouter.put('', menuItemDetailController.updateMenuItemDetail);
menuItemDetailRouter.delete('', menuItemDetailController.deleteMenuItemDetail);
menuItemDetailRouter.put('/status', menuItemDetailController.updateMenuItemDetailStatus);

module.exports = menuItemDetailRouter;