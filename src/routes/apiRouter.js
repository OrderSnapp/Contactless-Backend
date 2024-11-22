const express = require('express');
const router = express.Router();

// Import the individual route modules
const userRoute = require('./userRouter');
const authRoute = require('./authRouter');
const { authMiddleware, authRoleMiddleware } = require('../middlewares/authMiddleware');

// Use the routes
router.use('/users', authRoleMiddleware(['Admin']) ,userRoute);
router.use('/auth', authRoute);

module.exports = router;