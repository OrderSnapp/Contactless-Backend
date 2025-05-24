const express =  require('express');
const settingRouter = express.Router();

const settingController = require('../controllers/settingController');
const { authRoleMiddleware } = require('../middlewares/authMiddleware');

settingRouter.get('', settingController.getSetting);
settingRouter.put('', authRoleMiddleware(['Admin']), settingController.updateSetting);

module.exports = settingRouter;