const express = require('express');
const router = express.Router();

const { authRoleMiddleware } = require('../middlewares/authMiddleware');

// Use the route modules
router.use('/auth',require('./authRouter'));
router.use('/users',authRoleMiddleware(['Admin']),require('./userRouter'));
router.use('/tables',require('./tableRouter'));
router.use('/menus', require('./menuRouter'));
router.use('/menu-items', require('./menuItemRouter'));
router.use('/reviews', require('./reviewRouter'));
router.use('/menu-item-details', require('./menuItemDetailRouter'));
router.use('/settings', require('./settingRouter'));
router.use('/roles', authRoleMiddleware(['Admin']), require('./roleRouter'));
router.use('/orders', require('./orderRouter'));
router.use('/payments',authRoleMiddleware(['Admin','Staff']),require('./paymentRouter'));
router.use('/dashboard',authRoleMiddleware(['Admin','Staff']),require('./dashboard.router'));

module.exports = router;