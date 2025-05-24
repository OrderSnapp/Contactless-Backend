const express = require('express')
const tableRouter = express.Router();
const { authRoleMiddleware } = require('../middlewares/authMiddleware');

const tableController = require('../controllers/tableController')

tableRouter.post('', authRoleMiddleware(['Admin']), tableController.createTable);
tableRouter.get('', authRoleMiddleware(['Admin','Staff']), tableController.getTables);
tableRouter.post('/layout', authRoleMiddleware(['Admin']), tableController.createTableFromLayout);
tableRouter.get('/layout', authRoleMiddleware(['Admin','Staff']), tableController.getTablesLayout);
tableRouter.get('/:id', authRoleMiddleware(['Admin','Staff']), tableController.getTable);
tableRouter.put('/:id', authRoleMiddleware(['Admin']), tableController.updateTable);
tableRouter.delete('/:id', authRoleMiddleware(['Admin']), tableController.deleteTable);
tableRouter.post('/order/items', authRoleMiddleware(['Admin']), tableController.getTableOrderByTableId);

module.exports = tableRouter;