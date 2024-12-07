const express = require('express');
const router = express.Router();

// Import the individual route modules
const { authMiddleware, authRoleMiddleware } = require('../middlewares/authMiddleware');

// Use the route modules
router.use('/auth', require('./authRouter'));
router.use('/users', authRoleMiddleware(['Admin']) ,require('./userRouter'));
router.use('/tables',require('./tableRouter'));
router.use('/ingredients', require('./ingredientRouter'));
router.use('/menus', require('./menuRouter'));
router.use('/menu-items', require('./menuItemRouter'));
router.use('/reviews', require('./reviewRouter'));

module.exports = router;