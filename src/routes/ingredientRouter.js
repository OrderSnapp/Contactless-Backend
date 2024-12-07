const express = require('express')
const ingredientRouter = express.Router();

const ingredientController = require('../controllers/ingredientController');

ingredientRouter.post('', ingredientController.createIngredient);
ingredientRouter.get('', ingredientController.getIngredients);
ingredientRouter.get('/:id', ingredientController.getIngredient);
ingredientRouter.put('/:id', ingredientController.updateIngredient);
ingredientRouter.delete('/:id', ingredientController.deleteIngredient);

module.exports = ingredientRouter;