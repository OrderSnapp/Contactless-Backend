const express = require('express');
const menuItemDetailRouter = express.Router();

const menuItemDetailController = require('../controllers/menuItemDetailController');

menuItemDetailRouter.get('', menuItemDetailController.getCategoriesAndMenuItemDetails);
menuItemDetailRouter.post('', menuItemDetailController.createMenuItemDetails);

module.exports = menuItemDetailRouter;