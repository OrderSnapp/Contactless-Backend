const express = require('express')
const tableRouter = express.Router();
const { authMiddleware, authRoleMiddleware } = require('../middlewares/authMiddleware');

const tableController = require('../controllers/tableController')

tableRouter.post('', authRoleMiddleware(['Admin']), tableController.createTable);
tableRouter.get('', authMiddleware, tableController.getTables);
tableRouter.post('/layout', authRoleMiddleware(['Admin']), tableController.createTableFromLayout);
tableRouter.get('/layout', authMiddleware, tableController.getTablesLayout);
tableRouter.get('/:id', authMiddleware, tableController.getTable);
tableRouter.put('/:id', tableController.updateTable);
tableRouter.delete('/:id', authRoleMiddleware(['Admin']), tableController.deleteTable);
tableRouter.post('/order/items', authRoleMiddleware(['Admin']), tableController.getTableOrderByTableId);

module.exports = tableRouter;