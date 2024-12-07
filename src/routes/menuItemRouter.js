const express = require('express')
const menuItemRouter = express.Router();

const menuItemController = require('../controllers/menuItemController');

menuItemRouter.post('', menuItemController.createMenuItem);

module.exports = menuItemRouter;