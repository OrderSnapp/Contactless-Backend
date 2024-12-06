const express = require('express')
const tableRouter = express.Router();

const tableController = require('../controllers/tableController')

tableRouter.post('', tableController.createTable);
tableRouter.get('', tableController.getTables);
tableRouter.get('/:id', tableController.getTable);

module.exports = tableRouter;