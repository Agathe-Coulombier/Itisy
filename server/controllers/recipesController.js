const recipesService = require("../services/recipesService");

const scrapeRecipe = async (req, res) => {
    try {
        const { url } = req.query;
        const newRecipe = await recipesService.scrapeRecipe(url);
        res.status(200).json({ message: "Recipe scrapped successfully", newRecipe });
    } 
    catch (error) {
        console.log(error.message)
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

const editRecipe = async (req, res) => {
    try {
        await recipesService.editRecipeInDB(req.body);
        res.status(200).json({ message: "Recipe edited successfully" });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const deleteRecipe = async (req, res) => {
    console.log("controller", req.query)
    try {
        await recipesService.deleteRecipe(req.query);
        res.status(200).json({ message: "Recipe deleted successfully" });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const userRecipes = async (req, res) => {
    try {
        const data = await recipesService.userRecipes(req.query);
        res.status(200).json({ message: "Recipes extracted successfully", data });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const createFolder = async (req, res) => {
    try {
        recipes = await recipesService.createFolder(req.body);
        res.status(200).json({ message: "Folder created successfully"});
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const modifyFolder = async (req, res) => {
    try {
        recipes = await recipesService.modifyFolder(req.body);
        res.status(200).json({ message: "Folder modified successfully"});
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const deleteFolder = async (req, res) => {
    console.log(req)
    try {
        recipes = await recipesService.deleteFolder(req.body);
        res.status(200).json({ message: "Folder deleted successfully"});
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const uploadImage = async (req, res) => {
    try {
        const result = await recipesService.uploadImage(req, res);
        console.log("Upload result:", result); // Debug logging
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in uploadImage controller:", error); // Debug logging
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    scrapeRecipe,
    addRecipe,
    editRecipe,
    deleteRecipe,
    userRecipes,
    uploadImage,
    createFolder,
    modifyFolder,
    deleteFolder
};