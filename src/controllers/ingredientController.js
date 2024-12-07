const IngredientService = require('../services/ingredientService');

const createIngredient = async (req, res) => {
    const { name } = req.body;
    return IngredientService.createIngredientService({res, name});
}

const getIngredients = async (req, res) => {
    return IngredientService.getAllIngredientsService({res});
}

const getIngredient = async (req, res) => {
    const { id } = req.params;
    return IngredientService.getIngredientService({res, id});
}

const updateIngredient = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    return IngredientService.updateIngredientService({res, id, name});
}

const deleteIngredient = async (req, res) => {
    const { id } = req.params;
    return IngredientService.deleteIngredientService({res, id});
}

module.exports = {
    createIngredient,
    getIngredients,
    getIngredient,
    updateIngredient,
    deleteIngredient
};