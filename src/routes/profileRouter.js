const express = require('express')
const profileRouter = express.Router();

profileRouter.get('/:id', (req, res) => {
    const dummyData = [
        {
            id: 1,
            name: 'Ronaldo',
            email: 'ronaldo@example.com',
            imgUrl: 'https://hips.hearstapps.com/hmg-prod/images/cristiano-ronaldo-of-portugal-reacts-as-he-looks-on-during-news-photo-1725633476.jpg?crop=0.666xw:1.00xh;0.180xw,0&resize=640:*',
            address: '123 Main St, Anytown, USA',
            phone: '555-1234'
        },
        {
            id: 2,
            name: 'Messi01',
            email: 'messi01@example.com',
            imgUrl: 'https://imageio.forbes.com/specials-images/imageserve/663e595b4509f97fdafb95f5/0x0.jpg?format=jpg&crop=383,383,x1045,y23,safe&height=416&width=416&fit=bounds',
            address: '456 Elm St, Othertown, USA',
            phone: '555-5678'
        },
        {
            id: 3,
            name: 'Messi02',
            email: 'messi02@example.com',
            imgUrl: 'https://cdn.vox-cdn.com/thumbor/bCxXXdr3l4gHBCl6yGmhk7g2pkk=/0x0:3000x2000/1200x800/filters:focal(1160x657:1640x1137)/cdn.vox-cdn.com/uploads/chorus_image/image/73394030/2155658434.0.jpg',
            address: '789 Oak St, Sometown, USA',
            phone: '555-9012'
        }
    ];

    const { id } = req.params;
    const profile = dummyData.find(profile => profile.id === parseInt(id));

    res.json({
        status: 'success',
        message: 'Profile found',
        data: profile
    });
});

module.exports = profileRouter;