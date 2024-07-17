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

module.exports = {
    scrapeRecipe,
};