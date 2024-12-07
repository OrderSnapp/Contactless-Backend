const apiResponse = require('../utils/apiResponse');
const Ingredient = require('../models/ingredientModel');

const createIngredientService = async ({res,name}) => {
    try{
        const newRecord = await Ingredient.create({name});
        return apiResponse(res, 201, 'Ingredient created successfully', newRecord);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}
const getIngredientService = async ({res,id}) => {
    try{
        const ingredient = await Ingredient.findByPk(id);
        return apiResponse(res, 200, 'Ingredient retrieved successfully', ingredient);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}
const getAllIngredientsService = async ({res}) => {
    try{
        const ingredients = await Ingredient.findAll();
        return apiResponse(res, 200, 'Ingredients retrieved successfully', ingredients);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}
const updateIngredientService = async ({res,id,name}) => {
    try{
        const ingredient = await Ingredient.findByPk(id);
        if(!ingredient){
            return apiResponse(res, 404, 'Ingredient not found');
        }
        ingredient.name = name;
        ingredient.updatedAt = new Date();
        await ingredient.save();
        return apiResponse(res, 200, 'Ingredient updated successfully', ingredient);
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}
const deleteIngredientService = async ({res,id}) => {
    try{
        const ingredient = await Ingredient.findByPk(id);
        if(!ingredient){
            return apiResponse(res, 404, 'Ingredient not found');
        }
        await ingredient.destroy();
        return apiResponse(res, 200, 'Ingredient deleted successfully');
    }catch(error){
        return apiResponse(res, 500, error.message);
    }
}
    
module.exports = {
    createIngredientService,
    getIngredientService,
    getAllIngredientsService,
    updateIngredientService,
    deleteIngredientService
}