const express =  require('express');
const settingRouter = express.Router();

const settingController = require('../controllers/settingController');

settingRouter.get('', settingController.getSetting);

module.exports = settingRouter;