const express = require('express');
const router = express.Router();

// Import the individual route modules
const { authMiddleware, authRoleMiddleware } = require('../middlewares/authMiddleware');

// Use the route modules
router.use('/auth', require('./authRouter'));

// user route
router.use('/users', authRoleMiddleware(['Admin']) ,require('./userRouter'));

// table route
// router.use('/tables', authRoleMiddleware(['Admin']), require('./tableRouter'));
router.use('/tables',require('./tableRouter'));

module.exports = router;