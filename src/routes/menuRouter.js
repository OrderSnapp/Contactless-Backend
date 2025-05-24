const express = require('express')
const menuRouter = express.Router();

const menuController = require('../controllers/menuController');
const { authRoleMiddleware } = require('../middlewares/authMiddleware');

menuRouter.post('',authRoleMiddleware(['Admin']), menuController.createMenu);
menuRouter.get('',authRoleMiddleware(['Admin','Staff']), menuController.getMenus);
menuRouter.get('/:id',authRoleMiddleware(['Admin','Staff']), menuController.getMenu);
menuRouter.put('/:id',authRoleMiddleware(['Admin']), menuController.updateMenu);
menuRouter.delete('/:id',authRoleMiddleware(['Admin']), menuController.deleteMenu);

module.exports = menuRouter;