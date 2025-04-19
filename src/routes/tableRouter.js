const express = require('express')
const tableRouter = express.Router();

const tableController = require('../controllers/tableController')

tableRouter.post('', tableController.createTable);
tableRouter.get('', tableController.getTables);
tableRouter.post('/layout', tableController.createTableFromLayout);
tableRouter.get('/layout', tableController.getTablesLayout);
tableRouter.get('/:id', tableController.getTable);
tableRouter.put('/:id', tableController.updateTable);
tableRouter.delete('/:id', tableController.deleteTable);
tableRouter.get('/order/items', tableController.getTableOrderByTableId);

module.exports = tableRouter;