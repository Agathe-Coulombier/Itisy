const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController')

router.get("/scrap", recipesController.scrapeRecipe);
router.post("/addRecipe", recipesController.addRecipe);
router.put("/editRecipe", recipesController.editRecipe);
router.delete("/deleteRecipe", recipesController.deleteRecipe);
router.get('/userRecipes', recipesController.userRecipes);
router.post("/upload-image", recipesController.uploadImage);

module.exports = router;
