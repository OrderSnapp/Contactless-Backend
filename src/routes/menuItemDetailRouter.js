const express = require('express');
const menuItemDetailRouter = express.Router();

const menuItemDetailController = require('../controllers/menuItemDetailController');
const { authRoleMiddleware } = require('../middlewares/authMiddleware');

menuItemDetailRouter.get('',authRoleMiddleware(['Admin','Staff']), menuItemDetailController.getCategoriesAndMenuItemDetails);
menuItemDetailRouter.post('',authRoleMiddleware(['Admin']), menuItemDetailController.createMenuItemDetails);
menuItemDetailRouter.put('',authRoleMiddleware(['Admin']), menuItemDetailController.updateMenuItemDetail);
menuItemDetailRouter.delete('',authRoleMiddleware(['Admin']), menuItemDetailController.deleteMenuItemDetail);

module.exports = menuItemDetailRouter;