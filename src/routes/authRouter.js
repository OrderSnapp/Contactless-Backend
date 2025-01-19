const express = require('express')
const authRouter = express.Router();

const authController = require('../controllers/authController');
const {authMiddleware} = require('../middlewares/authMiddleware');

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/session', authMiddleware , authController.session);

module.exports = authRouter;
