const recipesService = require("../services/recipesService");

const scrapeRecipe = async (req, res) => {
    try {
        const data = await recipesService.scrapeRecipe(req.body);
        res.status(200).json({ message: "Recipe scrapped successfully", data });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const addRecipe = async (req, res) => {
    try {
        await recipesService.addRecipe(req.body);
        res.status(200).json({ message: "Recipe added successfully" });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const deleteRecipe = async (req, res) => {
    try {
        await recipesService.deleteRecipe(req.body);
        res.status(200).json({ message: "Recipe deleted successfully" });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const userRecipes = async (req, res) => {
    try {
        recipes = await recipesService.userRecipes(req.query.userId);
        res.status(200).json({ message: "Recipes extracted successfully", recipes });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    scrapeRecipe,
    addRecipe,
    deleteRecipe,
    userRecipes,
};