const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController')

router.get("/scrap", recipesController.scrapeRecipe);
router.post("/addRecipe", recipesController.addRecipe);
router.delete("/deleteRecipe", recipesController.deleteRecipe);
router.get('/userRecipes', recipesController.userRecipes)

module.exports = router;
