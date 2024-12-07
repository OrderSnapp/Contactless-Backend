const express = require('express')
const reviewRouter = express.Router();

const reviewController = require('../controllers/reviewController');

reviewRouter.post('', reviewController.createReview);
reviewRouter.get('', reviewController.getReviews);
reviewRouter.get('/:id', reviewController.getReview);
reviewRouter.put('/:id', reviewController.updateReview);
reviewRouter.delete('/:id', reviewController.deleteReview);

module.exports = reviewRouter;