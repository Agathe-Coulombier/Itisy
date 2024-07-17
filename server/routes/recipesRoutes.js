const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController')

router.get("/scrap", recipesController.scrapeRecipe);


module.exports = router;
