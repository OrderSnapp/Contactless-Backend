const express = require('express')
const roleRouter = express.Router();

const roleController = require('../controllers/roleController');

roleRouter.post('', roleController.createRole);
roleRouter.get('', roleController.getRoles);

module.exports = roleRouter;