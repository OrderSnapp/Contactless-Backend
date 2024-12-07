const ReviewService = require('../services/reviewService');

const createReview = async (req, res) => {
    return ReviewService.createReviewService({res});
}

const getReviews = async (req, res) => {
    return ReviewService.getAllReviewsService({res});
}

const getReview = async (req, res) => {
    const { id } = req.params;
    return ReviewService.getReviewService({res, id});
}

const updateReview = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    return ReviewService.updateReviewService({res, id, name});
}

const deleteReview = async (req, res) => {
    const { id } = req.params;
    return ReviewService.deleteReviewService({res, id});
}

module.exports = {
    createReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview
};