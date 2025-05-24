const express = require('express')
const menuItemRouter = express.Router();

const menuItemController = require('../controllers/menuItemController');
const { authRoleMiddleware } = require('../middlewares/authMiddleware');

menuItemRouter.post('', authRoleMiddleware(['Admin']), menuItemController.createMenuItem);
menuItemRouter.get('/:menuId', authRoleMiddleware(['Admin','Staff']), menuItemController.getMenuItems);
menuItemRouter.put('/:id', authRoleMiddleware(['Admin']), menuItemController.updateMenuItem);
menuItemRouter.delete('/:id', authRoleMiddleware(['Admin']), menuItemController.deleteMenuItem);

module.exports = menuItemRouter;