const express = require('express');
const router = express.Router();

// Import the individual route modules
const { authRoleMiddleware } = require('../middlewares/authMiddleware');

// Use the route modules
router.use('/auth', require('./authRouter'));
router.use('/users', authRoleMiddleware(['Admin']) ,require('./userRouter'));
router.use('/tables',require('./tableRouter'));
router.use('/ingredients', require('./ingredientRouter'));
router.use('/menus', require('./menuRouter'));
router.use('/menu-items', require('./menuItemRouter'));
router.use('/reviews', require('./reviewRouter'));
router.use('/menu-item-details', require('./menuItemDetailRouter'));
router.use('/settings', require('./settingRouter'));




router.use('/profiles', require('./profileRouter'));
router.get('/greeting', (req, res) => {
    const currentHour = new Date().getHours();
    let message;

    if (currentHour >= 5 && currentHour < 12) {
        message = 'Good morning';
    }else if(currentHour >= 12 && currentHour < 17){
        message = 'Good afternoon';
    } else if (currentHour >= 17 && currentHour < 22) {
        message = 'Good evening';
    } else {
        message = 'Good night';
    }

    res.json({
        status: 'success',
        message: 'Welcome to the Restaurant API',
        data: message
    });
});
router.get('/history', (req, res) => {
    const history = [
        {
            id: 1,
            name: 'Song Meysorng',
            img: 'https://cdn3.iconfinder.com/data/icons/avatars-flat/33/woman_9-512.png',
            emotion: 'Happy',
            created_at: '18:00:00'
        },
        {
            id: 2,
            name: 'Sun Chengchhay',
            img: 'https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png',
            emotion: 'Angry',
            created_at: '12:00:00'
        },
        {
            id: 3,
            name: 'Sokha Rithy',
            img: 'https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png',
            emotion: 'Surprised',
            created_at: '07:00:00'
        }
    ];

    res.json({
        status: 'success',
        message: 'History found',
        data: history
    });
});

module.exports = router;