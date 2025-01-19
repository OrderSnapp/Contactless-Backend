const express = require('express')
const userRouter = express.Router();

const userController = require('../controllers/userController');
const {authMiddleware, authRoleMiddleware} = require('../middlewares/authMiddleware');

userRouter.get('',authRoleMiddleware(['Admin']), userController.getAllUsers);
userRouter.post('',authRoleMiddleware(['Admin']), userController.createUser);
userRouter.get('/:id',authRoleMiddleware(['Admin']), userController.getUser);
userRouter.put('/:id',authRoleMiddleware(['Admin']), userController.updateUser);

module.exports = userRouter;