const express = require('express')
const authRouter = express.Router();

const authController = require('../controllers/authController');
const { authMiddleware, authRoleMiddleware } = require('../middlewares/authMiddleware');

authRouter.post('/register', authRoleMiddleware(['Admin']) ,authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/session', authMiddleware , authController.session);

module.exports = authRouter;
