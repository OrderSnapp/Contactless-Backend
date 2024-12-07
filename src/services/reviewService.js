const Review = require('../models/reviewModel');
const apiResponse = require('../utils/apiResponse');

const createReviewService = async ({res, name}) => {
    try{
        const newRecord = await Review.create({name});
        return apiResponse(res, 201, 'Review created successfully', newRecord);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
};
const getAllReviewsService = async ({res}) => {
    try{
        const reviews = await Review.findAll();
        return apiResponse(res, 200, 'Reviews retrieved successfully', reviews);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
};
const getReviewService = async ({res, id}) => {
    try{
        const review = await Review.findByPk(id);
        return apiResponse(res, 200, 'Review retrieved successfully', review);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
};
const updateReviewService = async ({res, id, name}) => {
    try{
        const review = await Review.findByPk(id);
        if(!review){
            return apiResponse(res, 404, 'Review not found');
        }
        review.name = name;
        review.updatedAt = new Date();
        await review.save();
        return apiResponse(res, 200, 'Review updated successfully', review);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
};
const deleteReviewService = async ({res, id}) => {
    try{
        const review = await Review.findByPk(id);
        if(!review){
            return apiResponse(res, 404, 'Review not found');
        }
        await review.destroy();
        return apiResponse(res, 200, 'Review deleted successfully');
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
};

module.exports = {
    createReviewService,
    getAllReviewsService,
    getReviewService,
    updateReviewService,
    deleteReviewService
}