const express = require('express')
const menuItemRouter = express.Router();

const menuItemController = require('../controllers/menuItemController');

menuItemRouter.post('', menuItemController.createMenuItem);
menuItemRouter.get('/:menuId', menuItemController.getMenuItems);
menuItemRouter.put('/:id', menuItemController.updateMenuItem);
menuItemRouter.delete('/:id', menuItemController.deleteMenuItem);

module.exports = menuItemRouter;