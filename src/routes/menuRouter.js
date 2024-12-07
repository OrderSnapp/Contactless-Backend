const express = require('express')
const menuRouter = express.Router();

const menuController = require('../controllers/menuController');

menuRouter.post('', menuController.createMenu);
menuRouter.get('', menuController.getMenus);
menuRouter.get('/:id', menuController.getMenu);
menuRouter.put('/:id', menuController.updateMenu);
menuRouter.delete('/:id', menuController.deleteMenu);

module.exports = menuRouter;